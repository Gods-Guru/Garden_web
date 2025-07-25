import React, { useState } from 'react';

const MediaManagement = ({ gardenId }) => {
  const [media] = useState([]);

  return (
    <div className="media-management">
      <div className="management-header">
        <h2>Media Management</h2>
        <p>Manage garden photos, videos, and media uploads</p>
      </div>

      <div className="management-actions">
        <button className="btn btn-primary">
          Upload Media
        </button>
      </div>

      <div className="media-gallery">
        {media.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📸</div>
            <h3>No media uploaded</h3>
            <p>Upload photos and videos to showcase your garden</p>
            <button className="btn btn-primary">
              Upload First Photo
            </button>
          </div>
        ) : (
          <div>Media gallery will go here</div>
        )}
      </div>

      <style jsx>{`
        .media-management {
          .management-header {
            margin-bottom: 2rem;
            
            h2 {
              font-size: 1.5rem;
              font-weight: 600;
              color: #111827;
              margin-bottom: 0.5rem;
            }
            
            p {
              color: #6b7280;
            }
          }

          .management-actions {
            margin-bottom: 2rem;
          }

          .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            
            .empty-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            
            h3 {
              font-size: 1.25rem;
              font-weight: 600;
              color: #111827;
              margin-bottom: 0.5rem;
            }
            
            p {
              color: #6b7280;
              margin-bottom: 2rem;
            }
          }

          .btn {
            display: inline-flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
            font-size: 0.875rem;

            &.btn-primary {
              background: #10b981;
              color: white;

              &:hover {
                background: #059669;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default MediaManagement;
