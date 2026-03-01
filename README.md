# Vegetation Vision MVP

Reference implementation of the Vegetation Vision brief: FastAPI + Next.js platform with ingestion, prediction, risk zones, and interactive visualization.

## File tree

```txt
backend/
  app/
    api/routes.py
    core/config.py
    db/{base.py,session.py}
    models/models.py
    schemas/schemas.py
    services/{ingestion.py,predict.py,risk.py}
    data/{sample_ndvi.json,risk_weights.yaml}
    scripts/init_db.py
    tests/test_api.py
    main.py
  requirements.txt
  Dockerfile
frontend/
  app/{layout.tsx,page.tsx,ui.tsx,globals.css}
  components/{ApiClient.tsx,CorridorSelector.tsx,FileUploader.tsx,GlobeVisualizer.tsx,Map2D.tsx,PredictionPanel.tsx,RiskZoneList.tsx,TimelinePicker.tsx,VegetationList.tsx}
  hooks/{useRiskZones.ts,useVegetation.ts}
  lib/{apiClient.ts,serverApi.ts}
  types/api.ts
  __tests__/FileUploader.test.tsx
  Dockerfile
  package.json
  tsconfig.json
docker-compose.yml
.env.example
Makefile
```

## Run

### Docker Compose (Postgres + PostGIS + backend + frontend)
```bash
docker-compose up --build
```

### Run separately
```bash
cp .env.example .env
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```

### SQLite fallback (no PostGIS)
Set `DATABASE_URL=sqlite:///./vegetation.db`. Geometry is stored as GeoJSON text in fallback mode.

## API
- `GET /health`
- `GET /api/v1/vegetation?corridorId={id}&since={ISO_date}`
- `POST /api/v1/predict`
- `GET /api/v1/riskzones?bbox=minLon,minLat,maxLon,maxLat`
- `POST /api/v1/upload` (disabled by default via `ENABLE_UPLOAD_ENDPOINT=false`; enable + secure with auth before production)

## Risk scoring formula
`risk = growth_weight*growth_score + proximity_weight*proximity_score + stress_weight*stress_score`

Weights live in `backend/app/data/risk_weights.yaml`.

## Data ingestion
`backend/app/services/ingestion.py` loads `backend/app/data/sample_ndvi.json` (small sample NDVI/environmental timeseries and corridor assets), computes storage-ready rows, and persists on startup.

To replace sample ingestion with real feeds, adapt ingestion to call NASA EarthData/MODIS/Sentinel-2 APIs and map responses to the same tile schema.

## Frontend features
- Globe view (`react-globe.gl`) + 2D map panel.
- Corridor selector + timeline picker.
- Prediction requests and results.
- Risk zone list/filter.
- Drag/drop GeoJSON/CSV upload with preview and export.
- Inspector panel for clicked features.

## Tests
```bash
make test-backend
make test-frontend
```

Cloud deploy note: build/push Docker images and deploy with managed Postgres/PostGIS on your provider (e.g., AWS ECS/Fargate + RDS Postgres).
