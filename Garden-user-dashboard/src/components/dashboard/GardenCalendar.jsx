// GardenCalendar Component
import React from 'react';
import { CalendarDays, Sprout, ShoppingBasket, Bell, Users } from 'lucide-react';

const GardenCalendar = () => {
  // Dummy data for calendar events/reminders
  const calendarEvents = [
    {
      id: 1,
      type: 'Planting',
      description: 'Corn (Plot B-05)',
      date: 'July 25',
      icon: <Sprout size={18} className="text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 2,
      type: 'Harvest',
      description: 'Basil (Plot A-01)',
      date: 'July 28',
      icon: <ShoppingBasket size={18} className="text-orange-500" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 3,
      type: 'Reminder',
      description: 'Check for tomato blight',
      date: 'August 01',
      icon: <Bell size={18} className="text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 4,
      type: 'Community Event',
      description: 'Garden Potluck & BBQ',
      date: 'August 05',
      icon: <Users size={18} className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
     {
      id: 5,
      type: 'Planting',
      description: 'Spinach - Fall Crop (Plot A-01)',
      date: 'August 10',
      icon: <Sprout size={18} className="text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
      <h2 className="text-2xl font-semibold text-primary-700 mb-6 flex items-center">
        <CalendarDays size={28} className="mr-2 text-primary-500" /> Garden Calendar
      </h2>

      {calendarEvents.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No upcoming events or reminders.</p>
      ) : (
        <ul className="space-y-3">
          {calendarEvents.map(event => (
            <li
              key={event.id}
              className={`flex items-center p-3 rounded-md border ${event.bgColor} ${event.borderColor} shadow-sm`}
            >
              <div className="flex-shrink-0 mr-3 p-1.5 bg-card rounded-full border border-border">
                 {event.icon}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-foreground">{event.type}: {event.description}</p>
                <p className="text-xs text-muted-foreground">Date: {event.date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {calendarEvents.length > 0 && (
         <div className="mt-6 text-center">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
                View Full Calendar
            </button>
        </div>
      )}
    </div>
  );
};

export default GardenCalendar;
