'use client';

import dynamic from 'next/dynamic';
import { VegetationRecord, RiskZone } from '@/types/api';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

export function GlobeVisualizer({
  vegetation,
  riskZones,
  onSelect
}: {
  vegetation: VegetationRecord[];
  riskZones: RiskZone[];
  onSelect: (item: any) => void;
}) {
  return (
    <div style={{ height: 420 }} aria-label="globe-visualizer">
      <Globe
        pointsData={vegetation.map((v) => ({
          ...v,
          lat: (v.geometry as any).coordinates[1],
          lng: (v.geometry as any).coordinates[0],
          size: 0.2 + v.ndvi
        }))}
        pointLat="lat"
        pointLng="lng"
        pointAltitude="size"
        pointColor={() => 'green'}
        onPointClick={onSelect}
      />
    </div>
  );
}
