import { Link, useLocation } from 'react-router-dom'
import { useUIStore, useAuthStore } from '../store'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HeartPulse, 
  Users, 
  Activity, 
  BarChart3, 
  LogOut, 
  Menu,
  X,
  Home
} from 'lucide-react'

const Layout = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      const { authService } = await import('../services')
      await authService.logout()
      logout()
    } catch (error) {
      console.error('Logout error:', error)
      logout()
    }
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/prediction', icon: HeartPulse, label: 'Prediction' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 glass-card z-50 p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <HeartPulse className="text-blue-400" />
                MediCare AI
              </h1>
              <button
                onClick={toggleSidebar}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass-card p-4 mb-4">
                <p className="text-white/70 text-sm">Logged in as</p>
                <p className="text-white font-semibold">{user?.full_name}</p>
                <p className="text-blue-400 text-xs capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : ''}`}>
        {/* Header */}
        <header className="glass-card m-4 p-4 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <Activity className="text-blue-400" />
            <span className="text-white/70">System Status: Online</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
