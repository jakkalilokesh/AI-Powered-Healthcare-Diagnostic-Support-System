import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { HeartPulse, Home } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTR2LTZoLTR2LTRoNHYtNmg0djZoNHY0aC00ek0yMCAzNHY2aC00di02aC00di00aDR2LTZoNHY2aDR2NGgtNHpNNjAgNDB2LTZoLTR2LTZoLTR2LTRoNHYtNmg0djZoNHY0aC00ek0wIDQwdi02aDR2LTZoNHYtNGgtNHYtNmgtNHY2aC00djRoNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"
        />
        <motion.div
          className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* 404 Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-8"
        >
          <HeartPulse className="text-white" size={64} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-bold text-white mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl text-white/70 mb-8"
        >
          Page not found
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/50 mb-8 max-w-md"
        >
          The page you're looking for doesn't exist or has been moved to a different location.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/')}
          className="glass-button flex items-center gap-2 mx-auto"
        >
          <Home size={20} />
          Back to Dashboard
        </motion.button>
      </motion.div>
    </div>
  )
}

export default NotFound
