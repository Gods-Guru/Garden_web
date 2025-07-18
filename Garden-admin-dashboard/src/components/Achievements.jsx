"use client"

import { useState } from "react"
import { Award, Star, Trophy, Target, Users, Leaf, Search } from "lucide-react"

const Achievements = ({ achievements, members }) => {
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch =
      achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || achievement.category === categoryFilter
    const matchesDifficulty = difficultyFilter === "all" || achievement.difficulty === difficultyFilter

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "gardening":
        return "bg-green-100 text-green-800"
      case "leadership":
        return "bg-purple-100 text-purple-800"
      case "community":
        return "bg-blue-100 text-blue-800"
      case "education":
        return "bg-orange-100 text-orange-800"
      case "sustainability":
        return "bg-teal-100 text-teal-800"
      case "maintenance":
        return "bg-gray-100 text-gray-800"
      case "expertise":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "gardening":
        return <Leaf className="w-5 h-5" />
      case "leadership":
        return <Trophy className="w-5 h-5" />
      case "community":
        return <Users className="w-5 h-5" />
      case "education":
        return <Target className="w-5 h-5" />
      case "sustainability":
        return <Leaf className="w-5 h-5" />
      case "maintenance":
        return <Star className="w-5 h-5" />
      case "expertise":
        return <Award className="w-5 h-5" />
      default:
        return <Award className="w-5 h-5" />
    }
  }

  const getUnlockedMembers = (achievementId) => {
    const achievement = achievements.find((a) => a.id === achievementId)
    if (!achievement) return []

    return members.filter((member) => achievement.unlockedBy.includes(member.id))
  }

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points * achievement.totalEarned, 0)
  const totalUnlocked = achievements.reduce((sum, achievement) => sum + achievement.totalEarned, 0)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="gardening">Gardening</option>
            <option value="leadership">Leadership</option>
            <option value="community">Community</option>
            <option value="education">Education</option>
            <option value="sustainability">Sustainability</option>
            <option value="maintenance">Maintenance</option>
            <option value="expertise">Expertise</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("")
              setCategoryFilter("all")
              setDifficultyFilter("all")
            }}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Achievements</p>
              <p className="text-2xl font-bold text-purple-600">{achievements.length}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Times Unlocked</p>
              <p className="text-2xl font-bold text-green-600">{totalUnlocked}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-yellow-600">{totalPoints.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-blue-600">
                {[...new Set(achievements.map((a) => a.category))].length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => {
          const unlockedMembers = getUnlockedMembers(achievement.id)
          return (
            <div
              key={achievement.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{achievement.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getCategoryColor(achievement.category)}`}
                      >
                        {achievement.category}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getDifficultyColor(achievement.difficulty)}`}
                      >
                        {achievement.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">{achievement.points}</span>
                  </div>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{achievement.description}</p>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                <ul className="space-y-1">
                  {achievement.requirements.map((requirement, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{achievement.totalEarned} earned</span>
                </div>

                {unlockedMembers.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Earned by:</p>
                    <div className="flex flex-wrap gap-1">
                      {unlockedMembers.slice(0, 3).map((member) => (
                        <span key={member.id} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          {member.name}
                        </span>
                      ))}
                      {unlockedMembers.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{unlockedMembers.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {unlockedMembers.length === 0 && (
                  <p className="text-xs text-gray-500 italic">No one has earned this achievement yet</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
          Achievement Leaderboard
        </h3>
        <div className="space-y-3">
          {members
            .sort((a, b) => b.achievements.length - a.achievements.length)
            .slice(0, 5)
            .map((member, index) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : index === 2
                            ? "bg-orange-500"
                            : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-900">{member.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{member.achievements.length}</p>
                    <p className="text-xs text-gray-500">achievements</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-yellow-600">
                      {member.achievements.reduce((sum, achievementName) => {
                        const achievement = achievements.find((a) => a.name === achievementName)
                        return sum + (achievement ? achievement.points : 0)
                      }, 0)}
                    </p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Achievements
