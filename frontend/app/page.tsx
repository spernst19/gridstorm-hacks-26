import { apiFetch } from '@/lib/serverApi';
import { VegetationResponse } from '@/types/api';
import { Dashboard } from './ui';

export default async function Home() {
  const initial = await apiFetch<VegetationResponse>('/api/v1/vegetation?corridorId=corridor-a&since=2025-01-01T00:00:00Z').catch(
    () => ({ corridorId: 'corridor-a', data: [] })
  );
  return <Dashboard initialVegetation={initial} />;
}
