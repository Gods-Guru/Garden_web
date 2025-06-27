import { DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt } from "lucide-react"

const FinancialReport = ({ dateRange }) => {
  const financialMetrics = [
    {
      label: "Total Revenue",
      value: "$12,847",
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Expenses",
      value: "$8,234",
      change: "+12%",
      trend: "up",
      icon: Receipt,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Net Profit",
      value: "$4,613",
      change: "+28%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Member Fees",
      value: "$9,240",
      change: "+15%",
      trend: "up",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  const revenueBreakdown = [
    { source: "Membership Fees", amount: 9240, percentage: 72, monthly: 1540 },
    { source: "Plot Rentals", amount: 2340, percentage: 18, monthly: 390 },
    { source: "Workshop Fees", amount: 780, percentage: 6, monthly: 130 },
    { source: "Equipment Rental", amount: 487, percentage: 4, monthly: 81 },
  ]

  const expenseBreakdown = [
    { category: "Utilities", amount: 2340, percentage: 28, monthly: 390, trend: "stable" },
    { category: "Maintenance", amount: 1890, percentage: 23, monthly: 315, trend: "increasing" },
    { category: "Supplies", amount: 1560, percentage: 19, monthly: 260, trend: "stable" },
    { category: "Insurance", amount: 1200, percentage: 15, monthly: 200, trend: "stable" },
    { category: "Equipment", amount: 890, percentage: 11, monthly: 148, trend: "decreasing" },
    { category: "Other", amount: 354, percentage: 4, monthly: 59, trend: "stable" },
  ]

  const monthlyFinancials = [
    { month: "Jan", revenue: 1890, expenses: 1234, profit: 656 },
    { month: "Feb", revenue: 2100, expenses: 1345, profit: 755 },
    { month: "Mar", revenue: 2340, expenses: 1456, profit: 884 },
    { month: "Apr", revenue: 2180, expenses: 1389, profit: 791 },
    { month: "May", revenue: 2450, expenses: 1567, profit: 883 },
    { month: "Jun", revenue: 1887, expenses: 1243, profit: 644 },
  ]

  const membershipAnalysis = [
    { type: "Individual", count: 89, fee: 60, revenue: 5340, percentage: 58 },
    { type: "Family", count: 34, fee: 90, revenue: 3060, percentage: 33 },
    { type: "Senior", count: 19, fee: 45, revenue: 855, percentage: 9 },
  ]

  const budgetComparison = [
    { category: "Revenue", budgeted: 12000, actual: 12847, variance: 847, status: "over" },
    { category: "Utilities", budgeted: 2400, actual: 2340, variance: -60, status: "under" },
    { category: "Maintenance", budgeted: 1800, actual: 1890, variance: 90, status: "over" },
    { category: "Supplies", budgeted: 1500, actual: 1560, variance: 60, status: "over" },
    { category: "Insurance", budgeted: 1200, actual: 1200, variance: 0, status: "on-target" },
  ]

  const paymentMethods = [
    { method: "Online Payment", amount: 8940, percentage: 70, transactions: 156 },
    { method: "Bank Transfer", amount: 2340, percentage: 18, transactions: 45 },
    { method: "Cash", amount: 1080, percentage: 8, transactions: 67 },
    { method: "Check", amount: 487, percentage: 4, transactions: 12 },
  ]

  const outstandingPayments = [
    { member: "John Smith", amount: 90, daysOverdue: 15, type: "Family Membership" },
    { member: "Mary Johnson", amount: 60, daysOverdue: 8, type: "Individual Membership" },
    { member: "David Brown", amount: 45, daysOverdue: 22, type: "Senior Membership" },
    { member: "Lisa Wilson", amount: 90, daysOverdue: 5, type: "Family Membership" },
  ]

  return (
    <div className="space-y-6">
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendIcon className="w-4 h-4" />
                  <span>{metric.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-sm">{metric.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            {revenueBreakdown.map((revenue, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{revenue.source}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">${revenue.monthly}/mo</span>
                    <span className="text-sm font-semibold text-gray-900">${revenue.amount}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${revenue.percentage}%` }}></div>
                </div>
                <p className="text-xs text-gray-500">{revenue.percentage}% of total revenue</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="space-y-4">
            {expenseBreakdown.map((expense, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        expense.trend === "increasing"
                          ? "bg-red-100 text-red-700"
                          : expense.trend === "decreasing"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {expense.trend}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">${expense.amount}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${expense.percentage}%` }}></div>
                </div>
                <p className="text-xs text-gray-500">
                  ${expense.monthly}/month ({expense.percentage}%)
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Financial Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Financial Trends</h3>
          <div className="space-y-4">
            {monthlyFinancials.map((month, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 w-12">{month.month}</span>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-600">${month.revenue}</span>
                    <span className="text-red-600">${month.expenses}</span>
                    <span className="font-semibold text-gray-900">${month.profit}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(month.revenue / 3000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(month.expenses / 2000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        {/* Membership Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Revenue Analysis</h3>
          <div className="space-y-4">
            {membershipAnalysis.map((membership, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{membership.type}</h4>
                  <span className="text-sm font-semibold text-gray-900">${membership.revenue}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Members</p>
                    <p className="font-semibold">{membership.count}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fee</p>
                    <p className="font-semibold">${membership.fee}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Share</p>
                    <p className="font-semibold">{membership.percentage}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Actual</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Budgeted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actual</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Variance</th>
                </tr>
              </thead>
              <tbody>
                {budgetComparison.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.category}</td>
                    <td className="py-3 px-4 text-gray-600">${item.budgeted}</td>
                    <td className="py-3 px-4 text-gray-600">${item.actual}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          item.status === "over"
                            ? "bg-red-100 text-red-700"
                            : item.status === "under"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.variance > 0 ? "+" : ""}${item.variance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{method.method}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{method.transactions} txns</span>
                    <span className="text-sm font-semibold text-gray-900">${method.amount}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${method.percentage}%` }}></div>
                </div>
                <p className="text-xs text-gray-500">{method.percentage}% of total payments</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outstanding Payments */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Outstanding Payments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Member</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Days Overdue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {outstandingPayments.map((payment, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{payment.member}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">${payment.amount}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{payment.daysOverdue} days</td>
                  <td className="py-3 px-4 text-gray-600">{payment.type}</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Send Reminder</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FinancialReport
