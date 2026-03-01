import json
from pathlib import Path
import yaml
from shapely.geometry import shape
from shapely.ops import unary_union
from app.core.config import settings
from app.models.models import VegetationTile, CorridorAsset


DEFAULT_WEIGHTS = {"growth": 0.45, "proximity": 0.35, "stress": 0.2}


def load_weights() -> dict[str, float]:
    path = Path(settings.risk_weights_file)
    if not path.exists():
        return DEFAULT_WEIGHTS
    with path.open("r", encoding="utf-8") as f:
        return {**DEFAULT_WEIGHTS, **yaml.safe_load(f)}


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(value, high))


def recommended_action(score: float) -> str:
    if score >= 0.7:
        return "trim"
    if score >= 0.45:
        return "inspect"
    return "monitor"


def compute_zone_risk(tile: VegetationTile, asset_geoms: list) -> tuple[float, str]:
    weights = load_weights()
    growth_score = clamp((tile.growth_rate + 0.1) / 0.3)
    proximity_score = clamp(1 - ((tile.distance_to_line_meters or 500) / 500))
    stress_score = clamp((tile.precipitation < 20) * (tile.growth_rate > 0.08) + (tile.temperature_c > 32) * 0.4)
    score = (
        growth_score * weights["growth"]
        + proximity_score * weights["proximity"]
        + stress_score * weights["stress"]
    )
    return round(clamp(score), 3), recommended_action(score)


def make_bbox_polygon(min_lon: float, min_lat: float, max_lon: float, max_lat: float):
    return shape(
        {
            "type": "Polygon",
            "coordinates": [
                [
                    [min_lon, min_lat],
                    [max_lon, min_lat],
                    [max_lon, max_lat],
                    [min_lon, max_lat],
                    [min_lon, min_lat],
                ]
            ],
        }
    )


def parse_geojson(raw: str):
    return shape(json.loads(raw))
