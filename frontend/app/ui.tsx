'use client';

import { useMemo, useState } from 'react';
import { CorridorSelector } from '@/components/CorridorSelector';
import { FileUploader, UploadedLayer } from '@/components/FileUploader';
import { GlobeVisualizer } from '@/components/GlobeVisualizer';
import { Map2D } from '@/components/Map2D';
import { PredictionPanel } from '@/components/PredictionPanel';
import { RiskZoneList } from '@/components/RiskZoneList';
import { TimelinePicker } from '@/components/TimelinePicker';
import { VegetationList } from '@/components/VegetationList';
import { useRiskZones } from '@/hooks/useRiskZones';
import { useVegetation } from '@/hooks/useVegetation';
import { VegetationResponse } from '@/types/api';

export function Dashboard({ initialVegetation }: { initialVegetation: VegetationResponse }) {
  const [corridorId, setCorridorId] = useState(initialVegetation.corridorId);
  const [since, setSince] = useState('2025-01-01T00:00:00.000Z');
  const [selected, setSelected] = useState<any>(null);
  const [layers, setLayers] = useState<UploadedLayer[]>([]);
  const { data: vegetation } = useVegetation(corridorId, since);
  const { data: risk } = useRiskZones('-180,-85,180,85');

  const vegData = vegetation?.data || initialVegetation.data;

  return (
    <main>
      <h1>Vegetation Vision MVP</h1>
      <CorridorSelector value={corridorId} onChange={setCorridorId} />
      <TimelinePicker since={since} onChange={setSince} />
      <FileUploader onLayer={(layer) => setLayers((prev) => [...prev, layer])} />
      <GlobeVisualizer vegetation={vegData} riskZones={risk?.zones || []} onSelect={setSelected} />
      <Map2D vegetation={vegData} />
      <PredictionPanel corridorId={corridorId} />
      <RiskZoneList zones={risk?.zones || []} />
      <VegetationList data={vegData} />
      <aside aria-label="inspector">
        <h3>Inspector</h3>
        <pre>{JSON.stringify(selected, null, 2)}</pre>
      </aside>
      <section>
        <h3>Uploaded Layers</h3>
        {layers.map((layer) => (
          <div key={layer.id}>
            <label>
              <input type="checkbox" checked={layer.enabled} onChange={() => setLayers((prev) => prev.map((l) => l.id === layer.id ? { ...l, enabled: !l.enabled } : l))} />
              {layer.name}
            </label>
            <button onClick={() => {
              const a = document.createElement('a');
              a.href = URL.createObjectURL(new Blob([JSON.stringify(layer.geojson)], { type: 'application/geo+json' }));
              a.download = `${layer.name}.geojson`;
              a.click();
            }}>Download GeoJSON</button>
          </div>
        ))}
      </section>
    </main>
  );
}
