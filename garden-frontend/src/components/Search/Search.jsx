import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.scss';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    gardens: [],
    events: [],
    posts: [],
    guides: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (type, id) => {
    switch (type) {
      case 'garden':
        navigate(`/gardens/${id}`);
        break;
      case 'event':
        navigate(`/events/${id}`);
        break;
      case 'post':
        navigate(`/forum/posts/${id}`);
        break;
      case 'guide':
        navigate(`/guides/${id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="search">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gardens, events, posts, guides..."
          className="search-input"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {query && !loading && (
        <div className="search-results">
          {Object.entries(results).map(([category, items]) => (
            items.length > 0 && (
              <div key={category} className="result-category">
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div className="result-items">
                  {items.map(item => (
                    <div
                      key={item._id}
                      className="result-item"
                      onClick={() => handleResultClick(category.slice(0, -1), item._id)}
                    >
                      <h4>{item.title || item.name}</h4>
                      {item.description && (
                        <p>{item.description.substring(0, 100)}...</p>
                      )}
                      <div className="result-meta">
                        {item.date && (
                          <span className="date">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        )}
                        {item.author && (
                          <span className="author">by {item.author.name}</span>
                        )}
                        {item.location && (
                          <span className="location">{item.location}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}

          {Object.values(results).every(arr => arr.length === 0) && (
            <div className="no-results">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
