import json
from datetime import datetime
from pathlib import Path
from sqlalchemy.orm import Session
from app.models.models import VegetationTile, CorridorAsset


def ingest_sample_data(db: Session, sample_file: str = "app/data/sample_ndvi.json") -> None:
    path = Path(sample_file)
    if not path.exists():
        return
    payload = json.loads(path.read_text(encoding="utf-8"))

    if db.query(VegetationTile).count() == 0:
        for tile in payload["tiles"]:
            db.add(
                VegetationTile(
                    id=tile["id"],
                    corridor_id=tile["corridor_id"],
                    species=tile.get("species"),
                    last_measured=datetime.fromisoformat(tile["last_measured"]),
                    ndvi=tile["ndvi"],
                    growth_rate=tile["growth_rate"],
                    precipitation=tile["precipitation"],
                    temperature_c=tile["temperature_c"],
                    height_meters=tile.get("height_meters"),
                    distance_to_line_meters=tile.get("distance_to_line_meters"),
                    geometry_geojson=json.dumps(tile["geometry"]),
                )
            )

    if db.query(CorridorAsset).count() == 0:
        for asset in payload["assets"]:
            db.add(
                CorridorAsset(
                    id=asset["id"],
                    corridor_id=asset["corridor_id"],
                    name=asset["name"],
                    geometry_geojson=json.dumps(asset["geometry"]),
                )
            )
    db.commit()
