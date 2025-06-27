"use client"

import { useMemo } from "react"
import { Lightbulb, TrendingDown, Award, AlertTriangle, Droplets, Leaf, Target, Calendar } from "lucide-react"

const ConservationInsights = ({ waterLogs }) => {
  const insights = useMemo(() => {
    if (waterLogs.length === 0) return []

    const now = new Date()
    const lastMonth = waterLogs.filter((log) => {
      const logDate = new Date(log.date)
      return logDate >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    })

    const lastWeek = waterLogs.filter((log) => {
      const logDate = new Date(log.date)
      return logDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    })

    // Calculate insights
    const insights = []

    // Method efficiency analysis
    const methodStats = {}
    waterLogs.forEach((log) => {
      if (!methodStats[log.method]) {
        methodStats[log.method] = { total: 0, count: 0, efficiency: 0 }
      }
      methodStats[log.method].total += log.amount
      methodStats[log.method].count += 1
      methodStats[log.method].efficiency += log.efficiency
    })

    const methodEfficiency = Object.entries(methodStats)
      .map(([method, stats]) => ({
        method,
        avgEfficiency: stats.efficiency / stats.count,
        totalWater: stats.total,
        sessions: stats.count,
      }))
      .sort((a, b) => b.avgEfficiency - a.avgEfficiency)

    // Most efficient method insight
    if (methodEfficiency.length > 1) {
      const mostEfficient = methodEfficiency[0]
      const leastEfficient = methodEfficiency[methodEfficiency.length - 1]
      const efficiencyDiff = mostEfficient.avgEfficiency - leastEfficient.avgEfficiency

      if (efficiencyDiff > 2) {
        insights.push({
          type: "efficiency",
          icon: Award,
          title: "Optimize Watering Methods",
          description: `${mostEfficient.method.replace("_", " ")} is ${Math.round(efficiencyDiff * 10) / 10} gal/hr more efficient than ${leastEfficient.method.replace("_", " ")}.`,
          recommendation: `Consider switching to ${mostEfficient.method.replace("_", " ")} for better water efficiency.`,
          impact: "high",
          savings: `Could save ${Math.round(efficiencyDiff * 2 * 10) / 10} gallons per hour`,
        })
      }
    }

    // Weather-based insights
    const recentRainyDays = lastWeek.filter((log) => log.weather?.rainfall > 0.1)
    if (recentRainyDays.length > 0) {
      const rainWatering = lastWeek.filter((log) => {
        const logDate = new Date(log.date)
        return recentRainyDays.some((rainy) => {
          const rainyDate = new Date(rainy.date)
          return Math.abs(logDate - rainyDate) < 24 * 60 * 60 * 1000
        })
      })

      if (rainWatering.length > 0) {
        const wastedWater = rainWatering.reduce((sum, log) => sum + log.amount, 0)
        insights.push({
          type: "weather",
          icon: AlertTriangle,
          title: "Weather-Based Conservation",
          description: `${Math.round(wastedWater)} gallons used on days with rainfall.`,
          recommendation: "Check weather forecasts before watering to avoid unnecessary usage.",
          impact: "medium",
          savings: `Could save ${Math.round(wastedWater * 0.7)} gallons per week`,
        })
      }
    }

    // Usage trend analysis
    const thisMonth = lastMonth.reduce((sum, log) => sum + log.amount, 0)
    const previousMonth = waterLogs
      .filter((log) => {
        const logDate = new Date(log.date)
        return (
          logDate >= new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()) &&
          logDate < new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        )
      })
      .reduce((sum, log) => sum + log.amount, 0)

    if (previousMonth > 0) {
      const changePercent = ((thisMonth - previousMonth) / previousMonth) * 100
      if (Math.abs(changePercent) > 15) {
        insights.push({
          type: "trend",
          icon: changePercent > 0 ? TrendingDown : Lightbulb,
          title: changePercent > 0 ? "Increasing Water Usage" : "Great Conservation Progress",
          description: `Water usage ${changePercent > 0 ? "increased" : "decreased"} by ${Math.abs(Math.round(changePercent))}% this month.`,
          recommendation:
            changePercent > 0
              ? "Review recent watering practices and consider more efficient methods."
              : "Keep up the excellent conservation efforts!",
          impact: changePercent > 0 ? "high" : "positive",
          savings: changePercent < 0 ? `Saved ${Math.round(Math.abs(thisMonth - previousMonth))} gallons` : null,
        })
      }
    }

    // Peak usage time analysis
    const hourlyUsage = {}
    waterLogs.forEach((log) => {
      const hour = Number.parseInt(log.time.split(":")[0])
      if (!hourlyUsage[hour]) hourlyUsage[hour] = 0
      hourlyUsage[hour] += log.amount
    })

    const peakHour = Object.entries(hourlyUsage).reduce(
      (max, [hour, usage]) => (usage > max.usage ? { hour: Number.parseInt(hour), usage } : max),
      { hour: 0, usage: 0 },
    )

    if (peakHour.hour >= 10 && peakHour.hour <= 16) {
      insights.push({
        type: "timing",
        icon: Target,
        title: "Optimize Watering Schedule",
        description: `Peak watering occurs at ${peakHour.hour}:00 during hot midday hours.`,
        recommendation: "Water early morning (6-8 AM) or evening (6-8 PM) to reduce evaporation.",
        impact: "medium",
        savings: "Could reduce water loss by 20-30% through better timing",
      })
    }

    // Plot efficiency analysis
    const plotStats = {}
    waterLogs.forEach((log) => {
      if (!plotStats[log.plotId]) {
        plotStats[log.plotId] = { total: 0, count: 0 }
      }
      plotStats[log.plotId].total += log.amount
      plotStats[log.plotId].count += 1
    })

    const plotUsage = Object.entries(plotStats)
      .map(([plot, stats]) => ({
        plot,
        avgPerSession: stats.total / stats.count,
        totalWater: stats.total,
      }))
      .sort((a, b) => b.avgPerSession - a.avgPerSession)

    if (plotUsage.length > 5) {
      const highUsagePlots = plotUsage.slice(0, 3)
      const avgUsage = plotUsage.reduce((sum, p) => sum + p.avgPerSession, 0) / plotUsage.length
      const excessivePlots = highUsagePlots.filter((p) => p.avgPerSession > avgUsage * 1.5)

      if (excessivePlots.length > 0) {
        insights.push({
          type: "plot",
          icon: Droplets,
          title: "High Water Usage Plots",
          description: `Plots ${excessivePlots.map((p) => p.plot).join(", ")} use significantly more water than average.`,
          recommendation:
            "Check these plots for water leaks, soil drainage issues, or consider drought-resistant plants.",
          impact: "medium",
          savings: `Could save ${Math.round(excessivePlots.reduce((sum, p) => sum + (p.avgPerSession - avgUsage), 0))} gallons per session`,
        })
      }
    }

    // Seasonal recommendations
    const currentMonth = now.getMonth()
    const seasonalTips = {
      spring: [2, 3, 4], // March, April, May
      summer: [5, 6, 7], // June, July, August
      fall: [8, 9, 10], // September, October, November
      winter: [11, 0, 1], // December, January, February
    }

    let currentSeason = "spring"
    Object.entries(seasonalTips).forEach(([season, months]) => {
      if (months.includes(currentMonth)) currentSeason = season
    })

    const seasonalAdvice = {
      spring: {
        title: "Spring Watering Tips",
        description: "Plants are actively growing and establishing root systems.",
        recommendation:
          "Water deeply but less frequently to encourage deep root growth. Monitor for new growth water needs.",
      },
      summer: {
        title: "Summer Conservation",
        description: "High temperatures increase evaporation and plant water stress.",
        recommendation:
          "Water early morning or late evening. Use mulch to retain moisture and consider drip irrigation.",
      },
      fall: {
        title: "Fall Preparation",
        description: "Plants are preparing for dormancy and need less water.",
        recommendation:
          "Gradually reduce watering frequency. Focus on deep watering for root establishment before winter.",
      },
      winter: {
        title: "Winter Efficiency",
        description: "Most plants are dormant and require minimal water.",
        recommendation: "Water only when soil is dry and temperatures are above freezing. Check for frozen pipes.",
      },
    }

    insights.push({
      type: "seasonal",
      icon: Calendar,
      title: seasonalAdvice[currentSeason].title,
      description: seasonalAdvice[currentSeason].description,
      recommendation: seasonalAdvice[currentSeason].recommendation,
      impact: "low",
      savings: null,
    })

    return insights
  }, [waterLogs])

  const getImpactColor = (impact) => {
    switch (impact) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "positive":
        return "border-green-200 bg-green-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  const getIconColor = (impact) => {
    switch (impact) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "positive":
        return "text-green-600"
      default:
        return "text-blue-600"
    }
  }

  // Conservation tips
  const conservationTips = [
    {
      icon: Droplets,
      title: "Drip Irrigation",
      description: "Install drip irrigation systems for 30-50% water savings compared to sprinklers.",
      difficulty: "Medium",
    },
    {
      icon: Leaf,
      title: "Mulching",
      description: "Apply 2-3 inches of mulch around plants to reduce evaporation by up to 70%.",
      difficulty: "Easy",
    },
    {
      icon: Target,
      title: "Smart Scheduling",
      description: "Water early morning (6-8 AM) when evaporation rates are lowest.",
      difficulty: "Easy",
    },
    {
      icon: TrendingDown,
      title: "Soil Improvement",
      description: "Add compost to improve soil water retention and reduce watering frequency.",
      difficulty: "Medium",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Water Conservation Insights</h2>
        <p className="text-gray-600">Personalized recommendations based on your garden's water usage patterns</p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div key={index} className={`border rounded-xl p-6 ${getImpactColor(insight.impact)}`}>
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg bg-white ${getIconColor(insight.impact)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <p className="text-gray-700 mb-3">{insight.description}</p>
                  <p className="text-sm font-medium text-gray-900 mb-2">Recommendation:</p>
                  <p className="text-sm text-gray-700">{insight.recommendation}</p>
                  {insight.savings && (
                    <div className="mt-3 p-2 bg-white rounded-lg">
                      <p className="text-sm font-medium text-green-700">💡 {insight.savings}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Conservation Tips */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
          Water Conservation Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conservationTips.map((tip, index) => {
            const Icon = tip.icon
            return (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        tip.difficulty === "Easy" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {tip.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{tip.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Water Saving Goals */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Monthly Conservation Challenge</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🎯 Reduce Usage by 15%</h4>
            <p className="text-sm opacity-90">Switch to more efficient watering methods</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">⏰ Optimize Timing</h4>
            <p className="text-sm opacity-90">Water during cooler morning hours</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🌱 Smart Plant Choices</h4>
            <p className="text-sm opacity-90">Consider drought-resistant varieties</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConservationInsights
