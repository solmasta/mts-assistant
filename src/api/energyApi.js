// energy calculation helpers for HVAC systems

export function calculateEnergyUsage({ load, efficiency, hours }) {
  const energyUsage = Number(load || 0) * Number(hours || 0) / Number(efficiency || 1);
  return {
    ok: true,
    energyUsage: Number.isFinite(energyUsage) ? energyUsage : 0,
  };
}

export function estimateCost({ energyUsage, rate }) {
  const estimatedCost = Number(energyUsage || 0) * Number(rate || 0);
  return {
    ok: true,
    estimatedCost: Number.isFinite(estimatedCost) ? estimatedCost : 0,
  };
}
