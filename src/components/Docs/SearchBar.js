import React from 'react';

export default function SearchBar({ value = '', onChange }) {
  return <input value={value} onChange={(event) => onChange?.(event.target.value)} placeholder="Search documents" />;
}
