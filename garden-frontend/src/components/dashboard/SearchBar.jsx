import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.scss';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsOpen(false);
    }
  };

  const suggestions = [
    { type: 'garden', name: 'Sunset Community Garden', icon: '🌱' },
    { type: 'plot', name: 'Plot #23', icon: '🌿' },
    { type: 'user', name: 'John Smith', icon: '👤' },
    { type: 'event', name: 'Spring Planting Workshop', icon: '📅' }
  ];

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search gardens, plots, users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </div>
      </form>

      {isOpen && query.length > 0 && (
        <div className="search-suggestions">
          {suggestions
            .filter(item => 
              item.name.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 4)
            .map((item, index) => (
              <div 
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setQuery(item.name);
                  setIsOpen(false);
                }}
              >
                <span className="suggestion-icon">{item.icon}</span>
                <span className="suggestion-name">{item.name}</span>
                <span className="suggestion-type">{item.type}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default SearchBar;
