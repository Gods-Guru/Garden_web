import { Users, TrendingUp, Calendar, MessageSquare } from "lucide-react"

const MemberActivity = ({ dateRange }) => {
  const activityMetrics = [
    { label: "Active Members", value: "142", change: "+8", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
    {
      label: "New Registrations",
      value: "12",
      change: "+3",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Event Attendance",
      value: "89%",
      change: "+5%",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Forum Posts",
      value: "67",
      change: "+15",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const memberEngagement = [
    { level: "Highly Active", count: 45, percentage: 32, description: "Daily activity, multiple contributions" },
    { level: "Active", count: 67, percentage: 47, description: "Regular participation, weekly activity" },
    { level: "Moderate", count: 23, percentage: 16, description: "Occasional participation" },
    { level: "Inactive", count: 7, percentage: 5, description: "No activity in 30+ days" },
  ]

  const topContributors = [
    { name: "Sarah Johnson", contributions: 45, type: "Tasks & Events", score: 95, badge: "Garden Champion" },
    { name: "Mike Chen", contributions: 38, type: "Forum & Mentoring", score: 92, badge: "Community Leader" },
    { name: "Emma Davis", contributions: 35, type: "Education & Workshops", score: 89, badge: "Knowledge Sharer" },
    { name: "David Wilson", contributions: 32, type: "Maintenance & Care", score: 87, badge: "Garden Keeper" },
    { name: "Lisa Brown", contributions: 28, type: "Events & Social", score: 85, badge: "Social Connector" },
  ]

  const activityByType = [
    { activity: "Plot Maintenance", participants: 89, avgTime: "2.5 hrs", frequency: "Weekly" },
    { activity: "Community Events", participants: 67, avgTime: "3.2 hrs", frequency: "Monthly" },
    { activity: "Forum Discussions", participants: 54, avgTime: "0.8 hrs", frequency: "Daily" },
    { activity: "Workshops", participants: 43, avgTime: "2.0 hrs", frequency: "Bi-weekly" },
    { activity: "Volunteer Work", participants: 32, avgTime: "4.1 hrs", frequency: "Monthly" },
  ]

  const membershipTrends = [
    { month: "Jan", newMembers: 8, activeMembers: 128, retention: 94 },
    { month: "Feb", newMembers: 12, activeMembers: 135, retention: 96 },
    { month: "Mar", newMembers: 15, activeMembers: 142, retention: 93 },
    { month: "Apr", newMembers: 9, activeMembers: 145, retention: 95 },
    { month: "May", newMembers: 11, activeMembers: 148, retention: 97 },
    { month: "Jun", newMembers: 7, activeMembers: 142, retention: 92 },
  ]

  const memberDemographics = [
    { category: "Age 18-30", count: 28, percentage: 20 },
    { category: "Age 31-45", count: 52, percentage: 37 },
    { category: "Age 46-60", count: 41, percentage: 29 },
    { category: "Age 60+", count: 21, percentage: 14 },
  ]

  const skillDistribution = [
    { skill: "Beginner", count: 45, percentage: 32, color: "bg-red-500" },
    { skill: "Intermediate", count: 67, percentage: 47, color: "bg-yellow-500" },
    { skill: "Advanced", count: 30, percentage: 21, color: "bg-green-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activityMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <span className="text-sm font-medium text-green-600">{metric.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-sm">{metric.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Engagement Levels */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Engagement Levels</h3>
          <div className="space-y-4">
            {memberEngagement.map((level, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{level.level}</span>
                  <span className="text-sm text-gray-600">
                    {level.count} members ({level.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      level.level === "Highly Active"
                        ? "bg-green-500"
                        : level.level === "Active"
                          ? "bg-blue-500"
                          : level.level === "Moderate"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                    style={{ width: `${level.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{level.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
          <div className="space-y-4">
            {topContributors.map((contributor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{contributor.name}</p>
                    <p className="text-sm text-gray-600">{contributor.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{contributor.contributions}</p>
                  <p className="text-xs text-green-600">{contributor.badge}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity by Type */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity by Type</h3>
          <div className="space-y-4">
            {activityByType.map((activity, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{activity.activity}</h4>
                  <span className="text-sm text-gray-600">{activity.frequency}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Participants</p>
                    <p className="font-semibold">{activity.participants}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Time</p>
                    <p className="font-semibold">{activity.avgTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Trends</h3>
          <div className="space-y-4">
            {membershipTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{trend.month}</span>
                <div className="flex-1 mx-4 space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>New: {trend.newMembers}</span>
                    <span>Active: {trend.activeMembers}</span>
                    <span>Retention: {trend.retention}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${trend.retention}%` }}></div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 w-12 text-right">+{trend.newMembers}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Demographics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Demographics</h3>
          <div className="space-y-4">
            {memberDemographics.map((demo, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{demo.category}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${demo.percentage}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16">
                    {demo.count} ({demo.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Level Distribution</h3>
          <div className="space-y-4">
            {skillDistribution.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                  <span className="text-sm text-gray-600">
                    {skill.count} members ({skill.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`h-3 rounded-full ${skill.color}`} style={{ width: `${skill.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>Most members are at intermediate level, showing good engagement with learning opportunities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberActivity
