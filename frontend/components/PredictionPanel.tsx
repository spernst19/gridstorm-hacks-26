'use client';
import { useState } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { PredictionResponse } from '@/types/api';

export function PredictionPanel({ corridorId }: { corridorId: string }) {
  const [months, setMonths] = useState(3);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function runPrediction() {
    try {
      setLoading(true);
      setError('');
      const response = await apiFetch<PredictionResponse>('/api/v1/predict', {
        method: 'POST',
        body: JSON.stringify({ corridorId, lookaheadMonths: months })
      });
      setResult(response);
    } catch (e) {
      setError('Prediction failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h3>Predictions</h3>
      <input aria-label="lookahead-months" type="number" min={1} max={24} value={months} onChange={(e) => setMonths(Number(e.target.value))} />
      <button onClick={runPrediction} disabled={loading}>{loading ? 'Running...' : 'Predict'}</button>
      {error && <p role="alert">{error}</p>}
      {result && <p>Model: {result.modelVersion} / Items: {result.predictions.length}</p>}
    </section>
  );
}
