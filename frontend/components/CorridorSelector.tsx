'use client';

export function CorridorSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label>
      Corridor
      <input aria-label="corridor-search" placeholder="search corridor" value={value} onChange={(e) => onChange(e.target.value)} />
      <select aria-label="corridor-selector" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="corridor-a">corridor-a</option>
        <option value="corridor-b">corridor-b</option>
      </select>
    </label>
  );
}
