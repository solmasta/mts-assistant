import React from 'react';

export default function ServiceLog({ entries = [] }) {
  return (
    <div>
      <h3>Service Log</h3>
      <ul>
        {entries.map((entry, index) => (
          <li key={`${entry.date || 'entry'}-${index}`}>{entry.note || 'Service entry'}</li>
        ))}
      </ul>
    </div>
  );
}
