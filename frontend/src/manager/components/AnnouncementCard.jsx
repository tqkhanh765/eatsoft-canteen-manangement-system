import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnnouncementCard = ({ announcement }) => {
  const navigate = useNavigate();

  const getBorderColor = (type) => {
    switch (type) {
      case 'Update':
        return '#22C55E';
      case 'Warning':
        return '#F97316';
      case 'News':
        return '#3B82F6';
      default:
        return '#22C55E';
    }
  };

  return (
    <div
      className="announcement-card"
      style={{ borderLeft: `4px solid ${getBorderColor(announcement.type)}` }}
      onClick={() => navigate(`/manager-announcement/${announcement.id}`)}
    >
      <h3 className="announcement-card-title">{announcement.title}</h3>
      <p className="announcement-card-content">{announcement.summary}</p>
      <div className="announcement-card-meta">
        <span className="meta-item">
          <span className="meta-label">Created at:</span> {announcement.createdAt}
        </span>
        <span className="meta-item">
          <span className="meta-label">Sent to:</span> {announcement.sentTo}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementCard;
