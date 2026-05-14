import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { patientService } from '../services'
import { usePatientStore } from '../store'
import { 
  Users, 
  HeartPulse, 
  Activity, 
  TrendingUp,
  ArrowRight
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const { setPatients } = usePatientStore()

  const { data: patientsData, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getPatients({ limit: 5 }),
  })

  useEffect(() => {
    if (patientsData) {
      setPatients(patientsData.patients)
    }
  }, [patientsData, setPatients])

  const stats = [
    { label: 'Total Patients', value: patientsData?.total || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Predictions Today', value: '12', icon: HeartPulse, color: 'from-green-500 to-emerald-500' },
    { label: 'High Risk Cases', value: '3', icon: Activity, color: 'from-red-500 to-orange-500' },
    { label: 'Accuracy Rate', value: '94%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/70">Welcome back! Here's your healthcare overview.</p>
        </div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.label}
                to={stat.label === 'Total Patients' ? '/patients' : '#'}
                className="block"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-6 h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                  </div>
                  <p className="text-white/70">{stat.label}</p>
                </motion.div>
              </Link>
            )
          })}
        </motion.div>

        {/* Recent Patients */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Patients</h2>
            <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors">
              View All <ArrowRight size={16} />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <div className="w-12 h-12 bg-white/10 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-1/3 animate-pulse" />
                    <div className="h-3 bg-white/10 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : patientsData?.patients?.length > 0 ? (
            <div className="space-y-4">
              {patientsData.patients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {patient.first_name[0]}{patient.last_name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-white/70 text-sm">{patient.gender} • {new Date(patient.date_of_birth).toLocaleDateString()}</p>
                  </div>
                  <ArrowRight className="text-white/50" size={20} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50">
              No patients yet. Add your first patient to get started.
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/prediction" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 cursor-pointer hover:bg-white/5 transition-colors h-full"
            >
              <HeartPulse className="text-blue-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">New Prediction</h3>
              <p className="text-white/70">Run heart disease risk assessment for a patient</p>
            </motion.div>
          </Link>
          <Link to="/patients" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 cursor-pointer hover:bg-white/5 transition-colors h-full"
            >
              <Users className="text-green-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Add Patient</h3>
              <p className="text-white/70">Register a new patient in the system</p>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  )
}

export default Dashboard
