import { User, Wrench, Sprout } from "lucide-react"

const PlotGrid = () => {
  // Generate dummy plot data
  const plots = Array.from({ length: 48 }, (_, i) => {
    const statuses = ["active", "vacant", "maintenance", "harvesting"]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    return {
      id: i + 1,
      status: randomStatus,
      owner: randomStatus === "active" ? `Gardener ${i + 1}` : null,
      crop:
        randomStatus === "active" ? ["Tomatoes", "Lettuce", "Carrots", "Herbs"][Math.floor(Math.random() * 4)] : null,
    }
  })

  const getPlotColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600"
      case "harvesting":
        return "bg-green-400 hover:bg-green-500"
      case "maintenance":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "vacant":
        return "bg-gray-300 hover:bg-gray-400"
      default:
        return "bg-gray-300"
    }
  }

  const getPlotIcon = (status) => {
    switch (status) {
      case "active":
        return <User className="w-4 h-4 text-white" />
      case "harvesting":
        return <Sprout className="w-4 h-4 text-white" />
      case "maintenance":
        return <Wrench className="w-4 h-4 text-white" />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-12 gap-2">
      {plots.map((plot) => (
        <div
          key={plot.id}
          className={`
            aspect-square rounded-lg cursor-pointer transition-all duration-200 
            flex items-center justify-center relative group
            ${getPlotColor(plot.status)}
          `}
          title={`Plot ${plot.id} - ${plot.status}${plot.owner ? ` - ${plot.owner}` : ""}`}
        >
          {getPlotIcon(plot.status)}

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            <div>Plot {plot.id}</div>
            <div className="capitalize">{plot.status}</div>
            {plot.owner && <div>{plot.owner}</div>}
            {plot.crop && <div>{plot.crop}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlotGrid
