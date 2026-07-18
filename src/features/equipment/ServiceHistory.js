import React from 'react';

export default function ServiceHistory({ entries = [] }) {
  return (
    <div>
      <h3>Service History</h3>
      <ul>
        {entries.map((entry, index) => (
          <li key={`${entry.date || 'entry'}-${index}`}>
            {entry.date || 'Date not provided'}: {entry.note || 'Service entry'}
          </li>
        ))}
      </ul>
    </div>
  );
}
