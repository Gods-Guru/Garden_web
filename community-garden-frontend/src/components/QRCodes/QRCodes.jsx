import React, { useState } from 'react';
import API from '../../api';
import './QRCodes.scss';

const QRCodes = () => {
  const [plotId, setPlotId] = useState('');
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQr(null);
    try {
      const res = await API.post('/qrcodes/generate', { plotId });
      setQr(res.data.qr.code);
    } catch (err) {
      setError('Could not generate QR code.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQr(null);
    try {
      const res = await API.get(`/qrcodes/${plotId}`);
      setQr(res.data.qr.code);
    } catch (err) {
      setError('Could not fetch QR code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qrcodes">
      <h2>Plot QR Codes</h2>
      <form className="qr-form">
        <input
          type="text"
          value={plotId}
          onChange={e => setPlotId(e.target.value)}
          placeholder="Plot ID"
          required
        />
        <button onClick={handleGenerate} disabled={loading}>Generate</button>
        <button onClick={handleFetch} disabled={loading}>Fetch</button>
      </form>
      {loading && <div className="qr-loading">Loading...</div>}
      {error && <div className="qr-error">{error}</div>}
      {qr && (
        <div className="qr-result">
          <img src={qr} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default QRCodes;
