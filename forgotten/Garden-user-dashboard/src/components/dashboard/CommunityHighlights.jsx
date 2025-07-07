// CommunityHighlights Component
import React from 'react';
import { Users, Image, CalendarCheck, MessageSquare, Sparkles } from 'lucide-react';

const CommunityHighlights = () => {
  // Dummy data for community highlights
  const highlights = [
    {
      id: 1,
      type: 'Photo Share',
      title: "Sarah's Amazing Sunflowers!",
      author: 'Sarah G.',
      imageUrl: '/placeholder-images/sunflowers.jpg', // Placeholder image
      icon: <Image size={18} className="text-pink-500" />,
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'Upcoming Event',
      title: 'Next Saturday: Seed Swap Meet!',
      details: 'Bring your extra seeds and starts to trade with fellow gardeners. 10 AM at the community shed.',
      icon: <CalendarCheck size={18} className="text-indigo-500" />,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      timestamp: 'Event on Aug 3',
    },
    {
      id: 3,
      type: 'Gardening Tip',
      title: 'Mulch Your Beds Before the Heatwave',
      author: 'Gardener Mike',
      details: 'A good layer of mulch helps retain moisture and suppress weeds. Straw or wood chips work great!',
      icon: <MessageSquare size={18} className="text-cyan-500" />,
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      timestamp: 'Tip of the week',
    },
    // UX Note: Keep content concise, use visuals where possible, and have clear CTAs if interaction is expected.
    // Avoid overwhelming the user with too many highlights. 3-4 items are usually good for a quick overview.
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
      <h2 className="text-2xl font-semibold text-primary-700 mb-6 flex items-center">
        <Sparkles size={28} className="mr-2 text-primary-500" /> Community Highlights
      </h2>

      {highlights.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No community highlights at the moment.</p>
      ) : (
        <div className="space-y-5">
          {highlights.map(item => (
            <div key={item.id} className={`p-4 rounded-md border ${item.bgColor} ${item.borderColor} shadow-sm`}>
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0 mr-2 p-1 bg-card rounded-full border border-border">
                    {item.icon}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider text-${item.icon.props.className.match(/text-(.*?)-500/)[1]}-600`}>
                    {item.type}
                </span>
              </div>

              <h3 className="text-md font-semibold text-foreground mb-1">{item.title}</h3>

              {item.imageUrl && (
                <img
                  src={item.imageUrl || "https://via.placeholder.com/300x150.png?text=Community+Highlight"}
                  alt={item.title}
                  className="w-full h-32 object-cover rounded-md my-2 border border-border"
                />
              )}

              {item.details && <p className="text-sm text-muted-foreground mb-1">{item.details}</p>}

              <div className="flex justify-between items-center mt-2">
                {item.author && <p className="text-xs text-muted-foreground">By: {item.author}</p>}
                <p className="text-xs text-muted-foreground ml-auto">{item.timestamp}</p>
              </div>

            </div>
          ))}
        </div>
      )}
      {highlights.length > 0 && (
         <div className="mt-6 text-center">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
                View More Community News
            </button>
        </div>
      )}
    </div>
  );
};

export default CommunityHighlights;
