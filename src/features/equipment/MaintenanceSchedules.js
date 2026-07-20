import React from 'react';

export default function MaintenanceSchedules({ schedules = [] }) {
  return (
    <div>
      <h3>Maintenance Schedules</h3>
      <ul>
        {schedules.map((schedule, index) => (
          <li key={`${schedule.task || 'schedule'}-${index}`}>
            <strong>{schedule.task || 'Maintenance Task'}</strong> — {schedule.frequency || 'As needed'}
          </li>
        ))}
      </ul>
    </div>
  );
}
