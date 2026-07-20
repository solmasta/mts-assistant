// parts inventory and lookup API

export async function fetchPartsInventory(query = '') {
  return {
    ok: true,
    query,
    results: [],
  };
}

export async function getPartDetails(partId) {
  return {
    ok: true,
    partId,
    details: null,
  };
}
