import React, { useMemo, useState } from 'react';

export default function BeltCalculator() {
  const [pulleyA, setPulleyA] = useState(12);
  const [pulleyB, setPulleyB] = useState(6);
  const [centerDistance, setCenterDistance] = useState(24);

  const result = useMemo(() => {
    const a = Number(pulleyA) || 0;
    const b = Number(pulleyB) || 0;
    const c = Number(centerDistance) || 0;
    const length = 2 * c + 1.57 * (a + b) + ((a - b) ** 2) / (4 * c);
    return {
      length: Number.isFinite(length) ? length.toFixed(2) : '0.00',
      tensionEstimate: Number.isFinite(length) ? (length / 10).toFixed(2) : '0.00',
    };
  }, [pulleyA, pulleyB, centerDistance]);

  return (
    <div>
      <h3>Belt Calculator</h3>
      <label>
        Small pulley diameter (in):
        <input type="number" value={pulleyA} onChange={(e) => setPulleyA(e.target.value)} />
      </label>
      <label>
        Large pulley diameter (in):
        <input type="number" value={pulleyB} onChange={(e) => setPulleyB(e.target.value)} />
      </label>
      <label>
        Center distance (in):
        <input type="number" value={centerDistance} onChange={(e) => setCenterDistance(e.target.value)} />
      </label>
      <p>Estimated belt length: {result.length} in</p>
      <p>Estimated tension factor: {result.tensionEstimate}</p>
    </div>
  );
}
