export interface VegetationRecord {
  id: string;
  species?: string;
  lastMeasured: string;
  ndvi: number;
  heightMeters?: number;
  distanceToLineMeters?: number;
  geometry: GeoJSON.Geometry;
}

export interface VegetationResponse {
  corridorId: string;
  data: VegetationRecord[];
}

export interface PredictionResponse {
  corridorId: string;
  predictions: { id: string; predictedNdvi?: number; predictedHeightMeters?: number; date: string }[];
  modelVersion: string;
}

export interface RiskZone {
  zoneId: string;
  riskScore: number;
  geometry: GeoJSON.Geometry;
  recommendedAction: 'inspect' | 'trim' | 'monitor';
}

export interface RiskZonesResponse {
  zones: RiskZone[];
}
