from datetime import datetime
import json
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.models import CorridorAsset, PredictionResult, VegetationTile
from app.schemas.schemas import HealthResponse, PredictRequest, PredictResponse, RiskZonesResponse, VegetationResponse
from app.services.predict import MODEL_VERSION, predict_for_tile
from app.services.risk import compute_zone_risk, make_bbox_polygon, parse_geojson

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@router.get("/api/v1/vegetation", response_model=VegetationResponse)
def get_vegetation(
    corridorId: str = Query(...),
    since: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(VegetationTile).filter(VegetationTile.corridor_id == corridorId)
    if since:
        try:
            since_dt = datetime.fromisoformat(since.replace("Z", "+00:00"))
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="since must be ISO date") from exc
        q = q.filter(VegetationTile.last_measured >= since_dt)
    rows = q.all()
    return {
        "corridorId": corridorId,
        "data": [
            {
                "id": r.id,
                "species": r.species,
                "lastMeasured": r.last_measured,
                "ndvi": r.ndvi,
                "heightMeters": r.height_meters,
                "distanceToLineMeters": r.distance_to_line_meters,
                "geometry": json.loads(r.geometry_geojson),
            }
            for r in rows
        ],
    }


@router.post("/api/v1/predict", response_model=PredictResponse)
def predict(req: PredictRequest, db: Session = Depends(get_db)):
    rows = db.query(VegetationTile).filter(VegetationTile.corridor_id == req.corridorId).all()
    if not rows:
        raise HTTPException(status_code=404, detail="corridor not found")
    predictions = [predict_for_tile(tile, req.lookaheadMonths) for tile in rows]
    for pred in predictions:
        db.add(
            PredictionResult(
                tile_id=pred["id"],
                corridor_id=req.corridorId,
                predicted_ndvi=pred["predictedNdvi"],
                predicted_height_meters=pred["predictedHeightMeters"],
                date=pred["date"],
                model_version=MODEL_VERSION,
            )
        )
    db.commit()
    return {"corridorId": req.corridorId, "predictions": predictions, "modelVersion": MODEL_VERSION}


@router.get("/api/v1/riskzones", response_model=RiskZonesResponse)
def riskzones(bbox: str = Query(...), db: Session = Depends(get_db)):
    try:
        min_lon, min_lat, max_lon, max_lat = [float(x) for x in bbox.split(",")]
    except Exception as exc:
        raise HTTPException(status_code=400, detail="bbox must be minLon,minLat,maxLon,maxLat") from exc

    box = make_bbox_polygon(min_lon, min_lat, max_lon, max_lat)
    tiles = db.query(VegetationTile).all()
    assets = db.query(CorridorAsset).all()

    zones = []
    for tile in tiles:
        geom = parse_geojson(tile.geometry_geojson)
        if not geom.intersects(box):
            continue
        score, action = compute_zone_risk(tile, assets)
        zones.append(
            {
                "zoneId": tile.id,
                "riskScore": score,
                "geometry": json.loads(tile.geometry_geojson),
                "recommendedAction": action,
            }
        )
    return {"zones": zones}


@router.post("/api/v1/upload")
async def upload(file: UploadFile = File(...)):
    if not settings.enable_upload_endpoint:
        raise HTTPException(status_code=403, detail="upload disabled")  # Set ENABLE_UPLOAD_ENDPOINT=true and add auth in production.
    content = await file.read()
    return {"filename": file.filename, "bytes": len(content)}
