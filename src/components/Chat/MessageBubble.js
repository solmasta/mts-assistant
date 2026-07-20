import React from 'react';

export default function MessageBubble({ role = 'assistant', content = '' }) {
  return <div><strong>{role}:</strong> {content}</div>;
}
