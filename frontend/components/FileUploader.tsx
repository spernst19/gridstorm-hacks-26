'use client';

import Papa from 'papaparse';
import { useMemo, useState } from 'react';

export interface UploadedLayer {
  id: string;
  name: string;
  enabled: boolean;
  geojson: GeoJSON.FeatureCollection;
}

function csvToGeoJSON(text: string): GeoJSON.FeatureCollection {
  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  const fields = parsed.meta.fields || [];
  const latKey = fields.find((f) => f.toLowerCase().includes('lat'));
  const lonKey = fields.find((f) => f.toLowerCase().includes('lon') || f.toLowerCase().includes('lng'));
  if (!latKey || !lonKey) throw new Error('Missing lat/lon columns');
  return {
    type: 'FeatureCollection',
    features: parsed.data.slice(0, 1000).map((row, i) => ({
      type: 'Feature',
      properties: row,
      geometry: { type: 'Point', coordinates: [Number(row[lonKey]), Number(row[latKey])] }
    }))
  };
}

export function FileUploader({ onLayer }: { onLayer: (layer: UploadedLayer) => void }) {
  const [preview, setPreview] = useState<GeoJSON.Feature[]>([]);

  async function handleFile(file: File) {
    const text = await file.text();
    let geojson: GeoJSON.FeatureCollection;
    if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
      geojson = JSON.parse(text);
    } else {
      geojson = csvToGeoJSON(text);
    }
    setPreview(geojson.features.slice(0, 10));
    onLayer({ id: `${Date.now()}`, name: file.name, enabled: true, geojson });
  }

  return (
    <section>
      <div
        aria-label="file-drop-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
        }}
        style={{ border: '2px dashed #aaa', padding: 12 }}
      >
        Drag and drop GeoJSON/CSV here
      </div>
      <input aria-label="file-input" type="file" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {preview.length > 0 && (
        <div>
          <h4>Preview (first 10)</h4>
          <pre aria-label="preview-json">{JSON.stringify(preview, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
