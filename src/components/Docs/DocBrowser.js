import React from 'react';

export default function DocBrowser({ documents = [] }) {
  return (
    <div>
      <h3>Documents</h3>
      <ul>
        {documents.map((doc, index) => (
          <li key={`${doc.title || 'doc'}-${index}`}>{doc.title || 'Untitled document'}</li>
        ))}
      </ul>
    </div>
  );
}
