import useSWR from 'swr';
import { apiFetch } from '@/lib/apiClient';
import { RiskZonesResponse } from '@/types/api';

export function useRiskZones(bbox: string) {
  const key = `/api/v1/riskzones?bbox=${bbox}`;
  return useSWR<RiskZonesResponse>(key, apiFetch);
}
