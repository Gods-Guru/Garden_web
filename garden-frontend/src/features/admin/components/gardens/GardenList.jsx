import React from 'react';

const GardenList = ({ gardens = [], onEdit, isLoading, error }) => {
  if (isLoading) return <div>Loading gardens...</div>;
  if (error) return <div>Error loading gardens.</div>;
  if (!gardens.length) return <div>No gardens found.</div>;
  return (
    <div className="garden-list">
      {gardens.map(garden => (
        <div key={garden._id} className="garden-card">
          <h3>{garden.name}</h3>
          <button onClick={() => onEdit(garden)}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default GardenList;
