import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Calendar, Heart, AlertCircle } from 'lucide-react'
import { patientService } from '../services'

const AddPatientModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'male',
    medical_history: '',
    allergies: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Ensure date_of_birth is in ISO format
      const payload = {
        ...formData,
        date_of_birth: new Date(formData.date_of_birth).toISOString(),
      }
      await patientService.createPatient(payload)
      onSuccess()
      onClose()
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: 'male',
        medical_history: '',
        allergies: '',
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add patient. Please check the data and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <User className="text-blue-400" size={24} />
            </div>
            Add New Patient
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 mb-2 text-sm font-medium">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="text"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="glass-input w-full pl-12"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 mb-2 text-sm font-medium">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="text"
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="glass-input w-full pl-12"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 mb-2 text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="glass-input w-full pl-12"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 mb-2 text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="glass-input w-full pl-12"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 mb-2 text-sm font-medium">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="date"
                    name="date_of_birth"
                    required
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="glass-input w-full pl-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 mb-2 text-sm font-medium">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="glass-input w-full"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm font-medium">Medical History</label>
              <div className="relative">
                <Heart className="absolute left-4 top-4 text-white/30" size={18} />
                <textarea
                  name="medical_history"
                  value={formData.medical_history}
                  onChange={handleChange}
                  rows="3"
                  className="glass-input w-full pl-12 py-3"
                  placeholder="Existing conditions, surgeries, etc."
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm font-medium">Allergies</label>
              <div className="relative">
                <AlertCircle className="absolute left-4 top-4 text-white/30" size={18} />
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows="2"
                  className="glass-input w-full pl-12 py-3"
                  placeholder="Medication or food allergies"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] glass-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Patient...' : 'Add Patient'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AddPatientModal
