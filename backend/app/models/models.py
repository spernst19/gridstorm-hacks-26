from datetime import datetime
from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class CorridorAsset(Base):
    __tablename__ = "corridor_assets"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    corridor_id: Mapped[str] = mapped_column(String, index=True)
    name: Mapped[str] = mapped_column(String)
    geometry_geojson: Mapped[str] = mapped_column(Text)


class VegetationTile(Base):
    __tablename__ = "vegetation_tiles"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    corridor_id: Mapped[str] = mapped_column(String, index=True)
    species: Mapped[str | None] = mapped_column(String, nullable=True)
    last_measured: Mapped[datetime] = mapped_column(DateTime)
    ndvi: Mapped[float] = mapped_column(Float)
    growth_rate: Mapped[float] = mapped_column(Float)
    precipitation: Mapped[float] = mapped_column(Float)
    temperature_c: Mapped[float] = mapped_column(Float)
    height_meters: Mapped[float | None] = mapped_column(Float, nullable=True)
    distance_to_line_meters: Mapped[float | None] = mapped_column(Float, nullable=True)
    geometry_geojson: Mapped[str] = mapped_column(Text)


class PredictionResult(Base):
    __tablename__ = "prediction_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tile_id: Mapped[str] = mapped_column(String, index=True)
    corridor_id: Mapped[str] = mapped_column(String, index=True)
    predicted_ndvi: Mapped[float] = mapped_column(Float)
    predicted_height_meters: Mapped[float] = mapped_column(Float)
    date: Mapped[datetime] = mapped_column(DateTime)
    model_version: Mapped[str] = mapped_column(String)
