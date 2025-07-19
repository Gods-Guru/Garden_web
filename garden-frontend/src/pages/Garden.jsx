import React, { useEffect, useState } from 'react';
import '../styles/pagestyles/Garden.scss';
import { Navbar } from '../components/common/Navbar';
import Footer from '../components/common/Footer';

function Spinner() {
  return <div className="spinner" aria-label="Loading" />;
}

export function Garden() {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch('/api/gardens')
      .then(res => res.text())
      .then(text => {
        let data;
        try { data = JSON.parse(text); } catch (e) { throw new Error('API error'); }
        if (!data.gardens) throw new Error(data.message || 'No gardens found');
        if (isMounted) {
          setGardens(data.gardens);
          setError(null);
        }
      })
      .catch(err => { if (isMounted) setError(err.message); })
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, []);

  // Filter gardens by search
  const filteredGardens = gardens.filter(g =>
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="gardens-page">
      <Navbar />
      <header className="gardens-hero">
        <h1>🌱 Community Gardens</h1>
        <p>Browse, search, and join a garden near you!</p>
        <input
          className="garden-search"
          type="text"
          placeholder="Search gardens by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </header>
      <main className="gardens-main">
        {loading ? (
          <div className="gardens-loading"><Spinner /></div>
        ) : error ? (
          <div className="gardens-error">{error}</div>
        ) : filteredGardens.length === 0 ? (
          <div className="gardens-empty">No gardens found.</div>
        ) : (
          <div className="gardens-list">
            {filteredGardens.map(garden => (
              <div className="garden-card" key={garden._id}>
                <div className="garden-card-header">
                  <h2>{garden.name}</h2>
                  <span className="garden-location">{garden.location || 'Unknown location'}</span>
                </div>
                <p className="garden-description">{garden.description || 'No description.'}</p>
                <div className="garden-meta">
                  <span>Plots: {garden.plots?.length ?? '-'}</span>
                  <span>Members: {garden.members?.length ?? '-'}</span>
                </div>
                <button className="btn btn-primary">View Garden</button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}