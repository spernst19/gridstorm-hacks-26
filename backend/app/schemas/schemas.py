from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str


class VegetationRecord(BaseModel):
    id: str
    species: str | None = None
    lastMeasured: datetime
    ndvi: float
    heightMeters: float | None = None
    distanceToLineMeters: float | None = None
    geometry: dict[str, Any]


class VegetationResponse(BaseModel):
    corridorId: str
    data: list[VegetationRecord]


class PredictRequest(BaseModel):
    corridorId: str
    lookaheadMonths: int = Field(ge=1, le=24)


class PredictionRecord(BaseModel):
    id: str
    predictedNdvi: float | None = None
    predictedHeightMeters: float | None = None
    date: datetime


class PredictResponse(BaseModel):
    corridorId: str
    predictions: list[PredictionRecord]
    modelVersion: str


class RiskZone(BaseModel):
    zoneId: str
    riskScore: float
    geometry: dict[str, Any]
    recommendedAction: Literal["inspect", "trim", "monitor"]


class RiskZonesResponse(BaseModel):
    zones: list[RiskZone]


class ErrorResponse(BaseModel):
    detail: str
