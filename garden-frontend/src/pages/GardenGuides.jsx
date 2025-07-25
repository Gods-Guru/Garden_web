import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function GardenGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchGuides() {
      setLoading(true);
      try {
        const res = await fetch('/api/guides', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch guides');
        setGuides(data.guides || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGuides();
  }, []);

  const filteredGuides = selectedCategory === 'all' 
    ? guides 
    : guides.filter(g => g.category === selectedCategory);

  return (
    <div className="garden-guides">
      <header className="guides-header">
        <h1>Garden Guides & Tips</h1>
        <p>Learn everything you need to know about gardening</p>
        
        <div className="category-filter">
          <button 
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Guides
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'vegetables' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('vegetables')}
          >
            Vegetables
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'herbs' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('herbs')}
          >
            Herbs
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'flowers' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('flowers')}
          >
            Flowers
          </button>
        </div>
      </header>

      <main className="guides-content">
        {loading ? (
          <div className="loading">Loading guides...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredGuides.length === 0 ? (
          <div className="empty">No guides found for this category.</div>
        ) : (
          <div className="guides-grid">
            {filteredGuides.map(guide => (
              <article key={guide._id} className="guide-card">
                <div className="guide-image">
                  {guide.imageUrl && <img src={guide.imageUrl} alt={guide.title} />}
                </div>
                <div className="guide-content">
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <div className="guide-meta">
                    <span className="category">{guide.category}</span>
                    <span className="difficulty">{guide.difficulty}</span>
                  </div>
                  <button className="btn btn-primary">Read More</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default GardenGuides;
