// manuals and schematics documents API

export async function fetchDocumentation(query = '') {
  return {
    ok: true,
    query,
    results: [],
  };
}

export async function getDocumentById(documentId) {
  return {
    ok: true,
    documentId,
    document: null,
  };
}
