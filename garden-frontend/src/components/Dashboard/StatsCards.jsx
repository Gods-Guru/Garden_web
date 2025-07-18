import "./StatsCards.scss"

const StatsCards = ({ stats, loading, userRole }) => {
  const getStatsForRole = () => {
    const baseStats = [
      {
        title: "Total Gardens",
        value: stats.totalGardens,
        icon: "🌿",
        color: "green",
        change: "+2 this month",
      },
      {
        title: "Active Plots",
        value: stats.totalPlots,
        icon: "🧱",
        color: "blue",
        change: "+12 this week",
      },
    ]

    if (userRole === "admin" || userRole === "manager") {
      baseStats.push(
        {
          title: "Active Tasks",
          value: stats.activeTasks,
          icon: "📋",
          color: "orange",
          change: "5 due today",
        },
        {
          title: "Volunteers",
          value: stats.totalVolunteers,
          icon: "🤝",
          color: "purple",
          change: "+7 this month",
        },
      )
    } else {
      baseStats.push({
        title: "My Tasks",
        value: 8,
        icon: "✅",
        color: "orange",
        change: "3 completed today",
      })
    }

    return baseStats
  }

  const statsToShow = getStatsForRole()

  if (loading) {
    return (
      <div className="stats-cards">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card loading">
            <div className="loading-shimmer"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="stats-cards">
      {statsToShow.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.color} fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-title">{stat.title}</p>
            <span className="stat-change">{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
