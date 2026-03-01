'use client';
import { useState } from 'react';
import { RiskZone } from '@/types/api';

export function RiskZoneList({ zones }: { zones: RiskZone[] }) {
  const [action, setAction] = useState<'all' | 'inspect' | 'trim' | 'monitor'>('all');
  const filtered = zones.filter((z) => action === 'all' || z.recommendedAction === action);
  return (
    <section>
      <h3>Risk Zones</h3>
      <select aria-label="risk-filter" value={action} onChange={(e) => setAction(e.target.value as any)}>
        <option value="all">all</option><option value="inspect">inspect</option><option value="trim">trim</option><option value="monitor">monitor</option>
      </select>
      <ul>{filtered.map((z) => <li key={z.zoneId}>{z.zoneId} - {z.riskScore} - {z.recommendedAction}</li>)}</ul>
    </section>
  );
}
