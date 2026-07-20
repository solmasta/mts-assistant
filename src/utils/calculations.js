export function calculateBeltLength({ pulleyA, pulleyB, centerDistance }) {
  const a = Number(pulleyA) || 0;
  const b = Number(pulleyB) || 0;
  const c = Number(centerDistance) || 0;
  return 2 * c + 1.57 * (a + b) + ((a - b) ** 2) / (4 * c);
}

export function calculateTensionEstimate(length) {
  return Number(length) || 0;
}
