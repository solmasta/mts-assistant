import { useMemo, useState } from 'react';

export function useChat(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages);

  const sendMessage = (content) => {
    setMessages((prev) => [...prev, { role: 'user', content }]);
  };

  return useMemo(() => ({ messages, sendMessage }), [messages]);
}
