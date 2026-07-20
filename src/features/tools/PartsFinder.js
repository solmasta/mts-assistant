import React, { useMemo, useState } from 'react';

const SAMPLE_PARTS = [
  { id: 'FILTER-1', name: 'MERV-8 Filter', generic: 'Standard 1" Filter', supplier: 'Local Supply Co.' },
  { id: 'BELT-1', name: 'AX-Series Belt', generic: 'V-Belt', supplier: 'HVAC Parts Depot' },
];

export default function PartsFinder() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const lower = query.toLowerCase();
    return SAMPLE_PARTS.filter((part) => `${part.name} ${part.generic} ${part.supplier}`.toLowerCase().includes(lower));
  }, [query]);

  return (
    <div>
      <h3>Parts Finder</h3>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search OEM part or description" />
      <ul>
        {results.map((part) => (
          <li key={part.id}>
            <strong>{part.name}</strong> — {part.generic} — {part.supplier}
          </li>
        ))}
      </ul>
    </div>
  );
}
