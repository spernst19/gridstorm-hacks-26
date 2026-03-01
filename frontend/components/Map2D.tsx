'use client';

import { VegetationRecord } from '@/types/api';

export function Map2D({ vegetation }: { vegetation: VegetationRecord[] }) {
  return (
    <div aria-label="2d-map" style={{ height: 220, overflow: 'auto', border: '1px solid #ddd' }}>
      <strong>2D Map (Leaflet placeholder using OSM-friendly fallback)</strong>
      {vegetation.map((v) => (
        <div key={v.id}>{v.id}: {(v.geometry as any).coordinates.join(', ')}</div>
      ))}
    </div>
  );
}
