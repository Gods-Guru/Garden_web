"use client"

import { CheckCircle, Clock, AlertTriangle, User } from "lucide-react"

const TaskAnalytics = ({ dateRange }) => {
  const taskStats = [
    { title: "Total Tasks", value: "342", change: "+28", trend: "up" },
    { title: "Completed", value: "267", change: "+22", trend: "up" },
    { title: "In Progress", value: "45", change: "+3", trend: "up" },
    { title: "Overdue", value: "30", change: "-5", trend: "down" },
  ]

  const tasksByCategory = [
    { category: "Maintenance", total: 89, completed: 72, percentage: 81 },
    { category: "Planting", total: 67, completed: 58, percentage: 87 },
    { category: "Harvesting", total: 54, completed: 48, percentage: 89 },
    { category: "Watering", total: 78, completed: 65, percentage: 83 },
    { category: "Pest Control", total: 32, completed: 24, percentage: 75 },
    { category: "Soil Care", total: 22, completed: 20, percentage: 91 },
  ]

  const tasksByPriority = [
    { priority: "High", total: 45, completed: 38, overdue: 4 },
    { priority: "Medium", total: 156, completed: 128, overdue: 12 },
    { priority: "Low", total: 141, completed: 101, overdue: 14 },
  ]

  const topPerformers = [
    { name: "Sarah Johnson", completed: 28, onTime: 26, efficiency: 93 },
    { name: "Mike Chen", completed: 24, onTime: 23, efficiency: 96 },
    { name: "Emma Davis", completed: 22, onTime: 20, efficiency: 91 },
    { name: "John Smith", completed: 19, onTime: 17, efficiency: 89 },
    { name: "Lisa Wilson", completed: 18, onTime: 16, efficiency: 89 },
  ]

  const overdueAnalysis = [
    { task: "Irrigation system repair", assignee: "Mike Chen", daysOverdue: 5, priority: "High" },
    { task: "Pest treatment - Section B", assignee: "Sarah Johnson", daysOverdue: 3, priority: "High" },
    { task: "Compost bin maintenance", assignee: "John Smith", daysOverdue: 7, priority: "Medium" },
    { task: "Tool shed organization", assignee: "Emma Davis", daysOverdue: 2, priority: "Low" },
    { task: "Fence repair - Plot A-15", assignee: "Lisa Wilson", daysOverdue: 4, priority: "Medium" },
  ]

  const weeklyProgress = [
    { week: "Week 1", completed: 68, assigned: 75, efficiency: 91 },
    { week: "Week 2", completed: 72, assigned: 78, efficiency: 92 },
    { week: "Week 3", completed: 65, assigned: 71, efficiency: 92 },
    { week: "Week 4", completed: 62, assigned: 68, efficiency: 91 },
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Analytics Dashboard</h2>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {taskStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              {stat.title === "Completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
              {stat.title === "In Progress" && <Clock className="w-4 h-4 text-blue-500" />}
              {stat.title === "Overdue" && <AlertTriangle className="w-4 h-4 text-red-500" />}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Tasks by Category */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Tasks by Category</h3>
            <p className="text-sm text-gray-600">Completion rates across different task types</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tasksByCategory.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <span className="text-sm text-gray-600">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: `${category.percentage}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Tasks by Priority</h3>
            <p className="text-sm text-gray-600">Completion status by priority level</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tasksByPriority.map((priority, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4
                      className={`font-medium ${
                        priority.priority === "High"
                          ? "text-red-700"
                          : priority.priority === "Medium"
                            ? "text-yellow-700"
                            : "text-green-700"
                      }`}
                    >
                      {priority.priority} Priority
                    </h4>
                    <span className="text-sm text-gray-600">{priority.total} total</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Completed</span>
                      <div className="font-medium text-green-600">{priority.completed}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">In Progress</span>
                      <div className="font-medium text-blue-600">
                        {priority.total - priority.completed - priority.overdue}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Overdue</span>
                      <div className="font-medium text-red-600">{priority.overdue}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Task Performers</h3>
          <p className="text-sm text-gray-600">Members with highest task completion rates</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-600">{performer.completed} tasks completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">On Time</div>
                      <div className="font-medium">
                        {performer.onTime}/{performer.completed}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Efficiency</div>
                      <div
                        className={`font-medium ${
                          performer.efficiency >= 95
                            ? "text-green-600"
                            : performer.efficiency >= 90
                              ? "text-blue-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {performer.efficiency}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overdue Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Overdue Tasks Analysis</h3>
          <p className="text-sm text-gray-600">Tasks requiring immediate attention</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Overdue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overdueAnalysis.map((task, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.task}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        task.daysOverdue > 5
                          ? "text-red-600"
                          : task.daysOverdue > 2
                            ? "text-yellow-600"
                            : "text-orange-600"
                      }`}
                    >
                      {task.daysOverdue} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Follow Up</button>
                    <button className="text-red-600 hover:text-red-900">Reassign</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Progress Trends</h3>
          <p className="text-sm text-gray-600">Task completion trends over the last 4 weeks</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {weeklyProgress.map((week, index) => (
              <div key={week.week} className="flex items-center space-x-6">
                <div className="w-16 text-sm font-medium text-gray-600">{week.week}</div>
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="text-sm font-medium">{Math.round((week.completed / week.assigned) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(week.completed / week.assigned) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="text-lg font-semibold text-green-600">{week.completed}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Efficiency</div>
                    <div className="text-lg font-semibold text-blue-600">{week.efficiency}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskAnalytics
