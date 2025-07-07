const ProgressCard = ({ label, value, color }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color} transition-all duration-300`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

export default ProgressCard
