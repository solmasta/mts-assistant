import React from 'react';

const SAMPLE_EQUIPMENT = [
  { id: 'CH-101', name: 'Chiller Unit', type: 'chiller', location: 'Main Plant' },
  { id: 'AHU-202', name: 'Air Handler', type: 'air_handler', location: 'North Wing' },
];

export default function EquipmentDatabase() {
  return (
    <div>
      <h3>Equipment Database</h3>
      <ul>
        {SAMPLE_EQUIPMENT.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> — {item.type} — {item.location}
          </li>
        ))}
      </ul>
    </div>
  );
}
