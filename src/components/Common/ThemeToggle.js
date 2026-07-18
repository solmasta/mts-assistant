import React from 'react';

export default function ThemeToggle({ theme, onToggle }) {
  return <button onClick={onToggle}>{theme === 'dark' ? 'Switch to light' : 'Switch to dark'}</button>;
}
