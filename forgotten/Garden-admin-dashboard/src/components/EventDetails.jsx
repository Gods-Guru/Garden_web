"use client"

import { X, Calendar, Clock, MapPin, Users, DollarSign, User, CheckCircle, XCircle, HelpCircle } from "lucide-react"

const EventDetails = ({ event, onClose }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case "workshop":
        return "bg-blue-100 text-blue-800"
      case "social":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-orange-100 text-orange-800"
      case "education":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800"
      case "ongoing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAttendeeStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "maybe":
        return <HelpCircle className="w-4 h-4 text-yellow-600" />
      case "declined":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Event Info */}
            <div className="lg:col-span-2 space-y-6">
              {event.image && (
                <div>
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getCategoryColor(event.category)}`}
                  >
                    {event.category}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(event.status)}`}
                  >
                    {event.status}
                  </span>
                  {event.cost > 0 && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                      ${event.cost}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h1>
                <p className="text-gray-700">{event.description}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">Date</p>
                      <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">Time</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(event.time)} ({event.duration} minutes)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900">Capacity</p>
                      <p className="text-sm text-gray-600">
                        {event.currentAttendees}/{event.maxAttendees} attendees
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-900">Organizer</p>
                      <p className="text-sm text-gray-600">{event.organizer}</p>
                    </div>
                  </div>

                  {event.cost > 0 && (
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-gray-900">Cost</p>
                        <p className="text-sm text-gray-600">${event.cost}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {event.materials && event.materials.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What to Bring</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {event.materials.map((material, index) => (
                      <li key={index} className="text-gray-700">
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.prerequisites && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Prerequisites</h3>
                  <p className="text-gray-700">{event.prerequisites}</p>
                </div>
              )}

              {event.tags && event.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Attendees & Actions */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Attendance</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Registered</span>
                    <span>
                      {event.currentAttendees}/{event.maxAttendees}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {event.status === "upcoming" && (
                  <div className="space-y-2">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Register for Event
                    </button>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Maybe Interested
                    </button>
                  </div>
                )}
              </div>

              {event.attendees && event.attendees.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Attendees</h3>
                  <div className="space-y-2">
                    {event.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{attendee.name}</span>
                        {getAttendeeStatusIcon(attendee.status)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
                <h3 className="font-semibold mb-2">Event Tips</h3>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Arrive 10 minutes early</li>
                  <li>• Bring water and snacks</li>
                  <li>• Wear comfortable clothes</li>
                  <li>• Don't forget your enthusiasm!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
