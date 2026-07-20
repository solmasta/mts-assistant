import React, { useMemo, useState } from 'react';

export default function ManualSearch({ manuals = [] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return manuals.filter((manual) => {
      const haystack = `${manual.title || ''} ${manual.category || ''} ${manual.tags || ''}`.toLowerCase();
      return haystack.includes(lower);
    });
  }, [manuals, query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search manuals"
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />
      <ul>
        {filtered.map((manual, index) => (
          <li key={`${manual.title || 'manual'}-${index}`}>{manual.title || 'Untitled manual'}</li>
        ))}
      </ul>
    </div>
  );
}
