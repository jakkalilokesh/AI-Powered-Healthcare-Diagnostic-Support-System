import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { patientService, predictionService } from '../services'
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin,
  HeartPulse,
  ArrowLeft
} from 'lucide-react'

const PatientDetail = () => {
  const { id } = useParams()

  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getPatient(id),
    enabled: !!id,
  })

  const { data: predictionsData, isLoading: predictionsLoading } = useQuery({
    queryKey: ['predictions', id],
    queryFn: () => predictionService.getPatientPredictions(id),
    enabled: !!id,
  })

  if (patientLoading) {
    return (
      <Layout>
        <div className="glass-card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/3" />
            <div className="h-4 bg-white/10 rounded w-1/2" />
            <div className="h-4 bg-white/10 rounded w-2/3" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Back Button */}
        <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          Back to Patients
        </button>

        {/* Patient Info Card */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {patient?.first_name[0]}{patient?.last_name[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {patient?.first_name} {patient?.last_name}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2 text-white/70">
                  <Calendar size={18} />
                  <span>{new Date(patient?.date_of_birth).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Mail size={18} />
                  <span>{patient?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Phone size={18} />
                  <span>{patient?.phone || 'N/A'}</span>
                </div>
              </div>
              {patient?.address && (
                <div className="flex items-center gap-2 text-white/70 mt-2">
                  <MapPin size={18} />
                  <span>{patient.address}</span>
                </div>
              )}
            </div>
          </div>

          {patient?.medical_history && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Medical History</h3>
              <p className="text-white/70">{patient.medical_history}</p>
            </div>
          )}

          {patient?.allergies && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Allergies</h3>
              <p className="text-white/70">{patient.allergies}</p>
            </div>
          )}
        </div>

        {/* Prediction History */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HeartPulse className="text-blue-400" />
              Prediction History
            </h2>
          </div>

          {predictionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-white/5 rounded-lg animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : predictionsData?.predictions?.length > 0 ? (
            <div className="space-y-4">
              {predictionsData.predictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">
                      Risk Level: {prediction.risk_level.toUpperCase()}
                    </span>
                    <span className="text-white/50 text-sm">
                      {new Date(prediction.prediction_date).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            prediction.risk_level === 'low'
                              ? 'bg-green-500'
                              : prediction.risk_level === 'moderate'
                              ? 'bg-yellow-500'
                              : prediction.risk_level === 'high'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${prediction.risk_probability * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-white font-bold">
                      {(prediction.risk_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-white/50 text-sm mt-2">
                    Confidence: {(prediction.confidence_score * 100).toFixed(1)}%
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50">
              No predictions yet. Run a prediction for this patient.
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  )
}

export default PatientDetail
