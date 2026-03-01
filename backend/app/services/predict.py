from datetime import datetime
from dateutil.relativedelta import relativedelta
from app.models.models import VegetationTile

MODEL_VERSION = "linear-slope-v1"


def predict_for_tile(tile: VegetationTile, lookahead_months: int) -> dict:
    predicted_ndvi = max(0.0, min(1.0, tile.ndvi + tile.growth_rate * lookahead_months))
    height_base = tile.height_meters or 2.0
    predicted_height = max(0.1, height_base + (tile.growth_rate * 3.5 * lookahead_months))
    return {
        "id": tile.id,
        "predictedNdvi": round(predicted_ndvi, 3),
        "predictedHeightMeters": round(predicted_height, 2),
        "date": tile.last_measured + relativedelta(months=lookahead_months),
    }
