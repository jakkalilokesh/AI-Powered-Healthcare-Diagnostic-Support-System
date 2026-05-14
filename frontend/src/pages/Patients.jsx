import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { patientService } from '../services'
import { usePatientStore } from '../store'
import { 
  Search, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Users
} from 'lucide-react'

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { patients, setPatients, removePatient } = usePatientStore()

  const { data: patientsData, isLoading, refetch } = useQuery({
    queryKey: ['patients', searchQuery],
    queryFn: () => patientService.getPatients({ search: searchQuery }),
  })

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleDelete = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(patientId)
        removePatient(patientId)
        refetch()
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Patients</h1>
            <p className="text-white/70">Manage your patient records</p>
          </div>
          <button className="glass-button flex items-center gap-2">
            <Plus size={20} />
            Add Patient
          </button>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchQuery}
              onChange={handleSearch}
              className="glass-input w-full pl-12"
            />
          </div>
        </div>

        {/* Patients List */}
        <div className="glass-card p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {patient.first_name[0]}{patient.last_name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-white/70 text-sm">
                      {patient.email || patient.phone || 'No contact info'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm">{patient.gender}</p>
                    <p className="text-white/50 text-xs">
                      {new Date(patient.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Edit className="text-blue-400" size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="text-red-400" size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white/50" size={32} />
              </div>
              <p className="text-white/50 mb-4">No patients found</p>
              <button className="glass-button">
                <Plus size={20} className="mr-2" />
                Add Your First Patient
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  )
}

export default Patients
