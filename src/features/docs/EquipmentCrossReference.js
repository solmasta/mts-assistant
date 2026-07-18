import React from 'react';

export default function EquipmentCrossReference({ equipment = [] }) {
  return (
    <div>
      <h3>Equipment Cross-Reference</h3>
      <ul>
        {equipment.map((item, index) => (
          <li key={`${item.name || 'equipment'}-${index}`}>
            {item.name || 'Unnamed equipment'}
            {item.reference ? ` — ${item.reference}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
