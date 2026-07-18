import React from 'react';

export default function ChatWindow({ messages = [] }) {
  return (
    <div>
      <h3>Chat</h3>
      {messages.map((message, index) => (
        <div key={`${message.role || 'msg'}-${index}`}>{message.content || ''}</div>
      ))}
    </div>
  );
}
