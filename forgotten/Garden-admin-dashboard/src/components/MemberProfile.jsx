"use client"

import { X, Mail, Phone, Award, MessageSquare, Calendar, Star, Instagram, Facebook } from "lucide-react"

const MemberProfile = ({ member, onClose }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case "coordinator":
        return "bg-purple-100 text-purple-800"
      case "treasurer":
        return "bg-blue-100 text-blue-800"
      case "secretary":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Member Profile</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getRoleColor(member.role)}`}
                  >
                    {member.role}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(member.status)}`}
                  >
                    {member.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{member.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              {(member.socialMedia.instagram || member.socialMedia.facebook) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Social Media</h3>
                  <div className="space-y-2">
                    {member.socialMedia.instagram && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <span className="text-gray-700">{member.socialMedia.instagram}</span>
                      </div>
                    )}
                    {member.socialMedia.facebook && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Facebook className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-700">{member.socialMedia.facebook}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                <div className="flex flex-wrap gap-1">
                  {member.availability.map((time) => (
                    <span key={time} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-1">
                  {member.languages.map((language) => (
                    <span key={language} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column - About & Specialties */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700">{member.bio}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Garden Plots</h3>
                {member.plots.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {member.plots.map((plot) => (
                      <span key={plot} className="px-3 py-1 bg-green-100 text-green-800 rounded-lg font-medium">
                        {plot}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No plots assigned</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((specialty) => (
                    <span key={specialty} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h3>
                <div className="grid grid-cols-2 gap-2">
                  {member.achievements.map((achievement) => (
                    <div key={achievement} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Activity & Stats */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Activity Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">Contributions</span>
                    </div>
                    <span className="font-semibold text-gray-900">{member.contributions}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">Events Attended</span>
                    </div>
                    <span className="font-semibold text-gray-900">{member.eventsAttended}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-700">Forum Posts</span>
                    </div>
                    <span className="font-semibold text-gray-900">{member.forumPosts}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-700">Achievements</span>
                    </div>
                    <span className="font-semibold text-gray-900">{member.achievements.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
                <h3 className="font-semibold mb-2">Community Impact</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm opacity-90">Engagement Level</span>
                    <span className="font-semibold">
                      {member.contributions > 30 ? "High" : member.contributions > 15 ? "Medium" : "Low"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-90">Member Since</span>
                    <span className="font-semibold">
                      {Math.floor((Date.now() - new Date(member.joinDate)) / (1000 * 60 * 60 * 24 * 30))} months
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberProfile
