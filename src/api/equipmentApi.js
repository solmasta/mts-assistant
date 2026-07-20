// equipment database access API

export async function fetchEquipmentList(filters = {}) {
  return {
    ok: true,
    filters,
    equipment: [],
  };
}

export async function getEquipmentById(equipmentId) {
  return {
    ok: true,
    equipmentId,
    equipment: null,
  };
}
