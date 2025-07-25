import React from 'react';

function RoleBadge({ role }) {
  let color = 'gray';
  if (role === 'admin') color = 'red';
  else if (role === 'second-admin') color = 'orange';
  else if (role === 'garden-admin') color = 'green';
  else if (role === 'user') color = 'blue';

  return (
    <span style={{ background: color, color: 'white', padding: '2px 8px', borderRadius: '8px', marginLeft: '8px', fontSize: '0.9em' }}>
      {role}
    </span>
  );
}

export default RoleBadge;
