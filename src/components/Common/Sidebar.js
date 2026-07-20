import React from 'react';

export default function Sidebar({ items = [] }) {
  return (
    <aside>
      <h3>Navigation</h3>
      <ul>
        {items.map((item, index) => (
          <li key={`${item.label || 'item'}-${index}`}>{item.label || 'Item'}</li>
        ))}
      </ul>
    </aside>
  );
}
