import React from 'react';

export default function EquipmentCard({ equipment }) {
  return (
    <div>
      <h3>{equipment?.name || 'Equipment'}</h3>
      <p>{equipment?.type || 'Unknown type'}</p>
    </div>
  );
}
