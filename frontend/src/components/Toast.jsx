import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../store'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const Toast = () => {
  const { toast, clearToast } = useUIStore()

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast()
      }, toast.duration || 5000)
      return () => clearTimeout(timer)
    }
  }, [toast, clearToast])

  const icons = {
    success: <CheckCircle className="text-green-400" />,
    error: <AlertCircle className="text-red-400" />,
    info: <Info className="text-blue-400" />,
  }

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="glass-card px-6 py-4 flex items-center gap-4 min-w-80">
            {icons[toast.type] || icons.info}
            <div className="flex-1">
              <p className="text-white font-semibold">{toast.title}</p>
              {toast.message && <p className="text-white/70 text-sm">{toast.message}</p>}
            </div>
            <button
              onClick={clearToast}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
