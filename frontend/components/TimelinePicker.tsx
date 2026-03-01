'use client';

export function TimelinePicker({ since, onChange }: { since: string; onChange: (value: string) => void }) {
  return (
    <label>
      Since
      <input aria-label="timeline-picker" type="date" value={since.slice(0, 10)} onChange={(e) => onChange(new Date(e.target.value).toISOString())} />
    </label>
  );
}
