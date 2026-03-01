import useSWR from 'swr';
import { apiFetch } from '@/lib/apiClient';
import { VegetationResponse } from '@/types/api';

export function useVegetation(corridorId: string, since: string) {
  const key = `/api/v1/vegetation?corridorId=${encodeURIComponent(corridorId)}&since=${encodeURIComponent(since)}`;
  return useSWR<VegetationResponse>(key, apiFetch);
}
