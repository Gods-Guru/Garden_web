"use client"

import { useState } from "react"
import { Search, Mail, Phone, MapPin, Award, MessageSquare, Calendar, User } from "lucide-react"
import MemberProfile from "./MemberProfile"

const MemberDirectory = ({ members }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [selectedMember, setSelectedMember] = useState(null)
  const [showProfile, setShowProfile] = useState(false)

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    const matchesSpecialty =
      specialtyFilter === "all" ||
      member.specialties.some((specialty) => specialty.toLowerCase().includes(specialtyFilter.toLowerCase()))

    return matchesSearch && matchesRole && matchesStatus && matchesSpecialty
  })

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

  const getAllSpecialties = () => {
    const specialties = new Set()
    members.forEach((member) => {
      member.specialties.forEach((specialty) => specialties.add(specialty))
    })
    return Array.from(specialties).sort()
  }

  const openMemberProfile = (member) => {
    setSelectedMember(member)
    setShowProfile(true)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="coordinator">Coordinator</option>
            <option value="treasurer">Treasurer</option>
            <option value="secretary">Secretary</option>
            <option value="member">Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Specialties</option>
            {getAllSpecialties().map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm("")
              setRoleFilter("all")
              setStatusFilter("all")
              setSpecialtyFilter("all")
            }}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={member.avatar || "/placeholder.svg"}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{member.name}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getRoleColor(member.role)}`}
                  >
                    {member.role}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(member.status)}`}
                  >
                    {member.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Member since {new Date(member.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{member.bio}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Plots: {member.plots.length > 0 ? member.plots.join(", ") : "None assigned"}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>{member.achievements.length} achievements</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>{member.forumPosts} forum posts</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{member.eventsAttended} events attended</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Specialties:</p>
              <div className="flex flex-wrap gap-1">
                {member.specialties.slice(0, 3).map((specialty) => (
                  <span key={specialty} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {specialty}
                  </span>
                ))}
                {member.specialties.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{member.specialties.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Send Message"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => openMemberProfile(member)}
                className="px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Member Profile Modal */}
      {showProfile && selectedMember && (
        <MemberProfile
          member={selectedMember}
          onClose={() => {
            setShowProfile(false)
            setSelectedMember(null)
          }}
        />
      )}
    </div>
  )
}

export default MemberDirectory
