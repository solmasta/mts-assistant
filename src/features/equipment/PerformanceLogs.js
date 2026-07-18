import React from 'react';

export default function PerformanceLogs({ logs = [] }) {
  return (
    <div>
      <h3>Performance Logs</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={`${log.label || 'log'}-${index}`}>
            {log.label || 'Performance Entry'}: {log.value || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
}
