import React from 'react';

export default function MaintenanceSchedule({ schedules = [] }) {
  return (
    <div>
      <h3>Maintenance Schedule</h3>
      <ul>
        {schedules.map((schedule, index) => (
          <li key={`${schedule.task || 'schedule'}-${index}`}>{schedule.task || 'Maintenance task'}</li>
        ))}
      </ul>
    </div>
  );
}
