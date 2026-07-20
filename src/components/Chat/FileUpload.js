import React from 'react';

export default function FileUpload({ onUpload }) {
  return (
    <label>
      Upload file
      <input type="file" onChange={(event) => onUpload?.(event.target.files?.[0])} />
    </label>
  );
}
