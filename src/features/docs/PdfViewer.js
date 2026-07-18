import React from 'react';

export default function PdfViewer({ url, title = 'Document' }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <h3>{title}</h3>
      <p>PDF viewer placeholder for {title}.</p>
      {url ? <p>Source: {url}</p> : <p>No document source provided.</p>}
    </div>
  );
}
