import React, { useEffect, useState } from 'react';
import API from '../../api';
import './Documents.scss';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/documents/my')
      .then(res => setDocuments(res.data.documents))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="documents">Loading...</div>;

  return (
    <div className="documents">
      <h2>My Documents</h2>
      {documents.length === 0 ? (
        <div>No documents found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Status</th>
              <th>Uploaded</th>
              <th>Reviewed By</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc._id}>
                <td>{doc.type}</td>
                <td>{doc.status}</td>
                <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
                <td>{doc.reviewedBy?.name || '-'}</td>
                <td>{doc.url ? <a href={doc.url} target="_blank" rel="noopener noreferrer">View</a> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Documents;
