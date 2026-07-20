import React from 'react';

export default function WarrantyTracking({ warranties = [] }) {
  return (
    <div>
      <h3>Warranty Tracking</h3>
      <ul>
        {warranties.map((warranty, index) => (
          <li key={`${warranty.item || 'warranty'}-${index}`}>
            {warranty.item || 'Item'} — Expires: {warranty.expiry || 'Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
}
