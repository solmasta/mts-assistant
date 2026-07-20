import React from 'react';

export default function QuickReferenceGuide({ sections = [] }) {
  return (
    <div>
      <h3>Quick Reference Guide</h3>
      <ul>
        {sections.map((section, index) => (
          <li key={`${section.title || 'section'}-${index}`}>
            <strong>{section.title || 'Section'}</strong>
            {section.summary ? ` — ${section.summary}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
