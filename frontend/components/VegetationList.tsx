'use client';
import { VegetationRecord } from '@/types/api';

export function VegetationList({ data }: { data: VegetationRecord[] }) {
  return (
    <div>
      <h3>Vegetation Records</h3>
      <ul>
        {data.slice(0, 10).map((v) => (
          <li key={v.id}>{v.id} NDVI:{v.ndvi} Species:{v.species || 'unknown'}</li>
        ))}
      </ul>
    </div>
  );
}
