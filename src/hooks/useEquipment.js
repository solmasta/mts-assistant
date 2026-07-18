import { useMemo } from 'react';

export function useEquipment(equipment = []) {
  return useMemo(() => equipment, [equipment]);
}
