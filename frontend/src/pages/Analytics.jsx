import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { patientService, predictionService } from '../services'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, Activity, Users, HeartPulse } from 'lucide-react'

const Analytics = () => {
  const { data: patientsData } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getPatients(),
  })

  // Mock data for charts (in production, this would come from the API)
  const riskDistribution = [
    { name: 'Low', value: 45, color: '#22c55e' },
    { name: 'Moderate', value: 30, color: '#eab308' },
    { name: 'High', value: 18, color: '#f97316' },
    { name: 'Very High', value: 7, color: '#ef4444' },
  ]

  const monthlyPredictions = [
    { month: 'Jan', predictions: 45 },
    { month: 'Feb', predictions: 52 },
    { month: 'Mar', predictions: 48 },
    { month: 'Apr', predictions: 61 },
    { month: 'May', predictions: 55 },
    { month: 'Jun', predictions: 67 },
  ]

  const ageDistribution = [
    { age: '20-30', count: 12 },
    { age: '31-40', count: 25 },
    { age: '41-50', count: 38 },
    { age: '51-60', count: 42 },
    { age: '61-70', count: 28 },
    { age: '70+', count: 15 },
  ]

  const stats = [
    { label: 'Total Predictions', value: '328', icon: Activity, color: 'from-blue-500 to-cyan-500' },
    { label: 'High Risk Detected', value: '82', icon: HeartPulse, color: 'from-red-500 to-orange-500' },
    { label: 'Patients Monitored', value: patientsData?.total || 0, icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'Accuracy Rate', value: '94.2%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-white/70">Comprehensive insights into healthcare diagnostics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-white/70">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Risk Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Predictions Line Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Monthly Predictions Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPredictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="predictions"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Age Distribution Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Patient Age Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="age" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Key Performance Metrics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-white/70">Model Accuracy</span>
                <span className="text-2xl font-bold text-green-400">94.2%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-white/70">Prediction Success Rate</span>
                <span className="text-2xl font-bold text-blue-400">98.5%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-white/70">Average Response Time</span>
                <span className="text-2xl font-bold text-purple-400">0.3s</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-white/70">Patient Satisfaction</span>
                <span className="text-2xl font-bold text-cyan-400">4.8/5</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default Analytics
