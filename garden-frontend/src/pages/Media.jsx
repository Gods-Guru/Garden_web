import React, { useEffect, useState } from 'react';
import '../styles/pagestyles/Media.scss';
import { Navbar } from '../components/common/Navbar';
import Footer from '../components/common/Footer';

function Spinner() {
  return <div className="spinner" aria-label="Loading" />;
}

export function Media() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch('/api/media')
      .then(res => res.text())
      .then(text => {
        let data;
        try { data = JSON.parse(text); } catch (e) { throw new Error('API error'); }
        if (!data.media) throw new Error(data.message || 'No media found');
        if (isMounted) {
          setMedia(data.media);
          setError(null);
        }
      })
      .catch(err => { if (isMounted) setError(err.message); })
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, []);

  // Filter by search (filename or caption)
  const filteredMedia = media.filter(m =>
    m.caption?.toLowerCase().includes(search.toLowerCase()) ||
    m.filename?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="media-page">
      <Navbar />
      <header className="media-hero">
        <h1>📸 Community Media Gallery</h1>
        <p>Browse and enjoy photos and videos shared by the community.</p>
        <input
          className="media-search"
          type="text"
          placeholder="Search media by caption or filename..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </header>
      <main className="media-main">
        {loading ? (
          <div className="media-loading"><Spinner /></div>
        ) : error ? (
          <div className="media-error">{error}</div>
        ) : filteredMedia.length === 0 ? (
          <div className="media-empty">No media found.</div>
        ) : (
          <div className="media-grid">
            {filteredMedia.map(item => (
              <div className="media-card" key={item._id}>
                {item.type?.startsWith('image') ? (
                  <img
                    src={item.url || `/media/${item.filename}`}
                    alt={item.caption || item.filename}
                    className="media-thumb"
                    onClick={() => setPreview(item)}
                  />
                ) : item.type?.startsWith('video') ? (
                  <video
                    src={item.url || `/media/${item.filename}`}
                    controls
                    className="media-thumb"
                  />
                ) : (
                  <div className="media-unknown">Unknown media</div>
                )}
                <div className="media-caption">{item.caption || item.filename}</div>
              </div>
            ))}
          </div>
        )}
        {preview && (
          <div className="media-preview-overlay" onClick={() => setPreview(null)}>
            <div className="media-preview-modal" onClick={e => e.stopPropagation()}>
              <button className="media-preview-close" onClick={() => setPreview(null)}>&times;</button>
              {preview.type?.startsWith('image') ? (
                <img src={preview.url || `/media/${preview.filename}`} alt={preview.caption || preview.filename} />
              ) : preview.type?.startsWith('video') ? (
                <video src={preview.url || `/media/${preview.filename}`} controls autoPlay />
              ) : null}
              <div className="media-preview-caption">{preview.caption || preview.filename}</div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}