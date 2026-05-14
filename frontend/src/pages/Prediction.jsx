import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation, useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { patientService, predictionService } from '../services'
import { usePatientStore } from '../store'
import { HeartPulse, Activity, AlertTriangle } from 'lucide-react'

const Prediction = () => {
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [formData, setFormData] = useState({
    age: '',
    sex: '1',
    cp: '1',
    trestbps: '',
    chol: '',
    fbs: '0',
    restecg: '0',
    thalach: '',
    exang: '0',
    oldpeak: '',
    slope: '1',
    ca: '0',
    thal: '0',
  })
  const [result, setResult] = useState(null)

  const { data: patientsData } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getPatients(),
  })

  const predictionMutation = useMutation({
    mutationFn: (data) => predictionService.createPrediction(data),
    onSuccess: (data) => {
      setResult(data)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const predictionData = {
      patient_id: parseInt(selectedPatientId),
      ...formData,
      age: parseInt(formData.age),
      trestbps: parseInt(formData.trestbps),
      chol: parseInt(formData.chol),
      thalach: parseInt(formData.thalach),
      oldpeak: parseFloat(formData.oldpeak),
      cp: parseInt(formData.cp),
      fbs: parseInt(formData.fbs),
      restecg: parseInt(formData.restecg),
      exang: parseInt(formData.exang),
      slope: parseInt(formData.slope),
      ca: parseInt(formData.ca),
      thal: parseInt(formData.thal),
    }
    predictionMutation.mutate(predictionData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'low':
        return 'from-green-500 to-emerald-500'
      case 'moderate':
        return 'from-yellow-500 to-orange-500'
      case 'high':
        return 'from-orange-500 to-red-500'
      case 'very_high':
        return 'from-red-500 to-red-600'
      default:
        return 'from-blue-500 to-cyan-500'
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
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Heart Disease Prediction</h1>
          <p className="text-white/70">AI-powered risk assessment using patient vitals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-blue-400" />
              Patient Vitals
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 mb-2 text-sm">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="glass-input w-full"
                  required
                >
                  <option value="">Choose a patient</option>
                  {patientsData?.patients?.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="glass-input w-full"
                    placeholder="Age (1-120)"
                    min="1"
                    max="120"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Sex</label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="glass-input w-full"
                    required
                  >
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Resting BP (mmHg)</label>
                  <input
                    type="number"
                    name="trestbps"
                    value={formData.trestbps}
                    onChange={handleChange}
                    className="glass-input w-full"
                    placeholder="80-200"
                    min="80"
                    max="200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Cholesterol (mg/dl)</label>
                  <input
                    type="number"
                    name="chol"
                    value={formData.chol}
                    onChange={handleChange}
                    className="glass-input w-full"
                    placeholder="100-600"
                    min="100"
                    max="600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Max Heart Rate</label>
                  <input
                    type="number"
                    name="thalach"
                    value={formData.thalach}
                    onChange={handleChange}
                    className="glass-input w-full"
                    placeholder="60-220"
                    min="60"
                    max="220"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm">ST Depression</label>
                  <input
                    type="number"
                    step="0.1"
                    name="oldpeak"
                    value={formData.oldpeak}
                    onChange={handleChange}
                    className="glass-input w-full"
                    placeholder="0.0-6.0"
                    min="0"
                    max="6"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Chest Pain Type</label>
                  <select
                    name="cp"
                    value={formData.cp}
                    onChange={handleChange}
                    className="glass-input w-full"
                    required
                  >
                    <option value="1">Typical Angina</option>
                    <option value="2">Atypical Angina</option>
                    <option value="3">Non-anginal Pain</option>
                    <option value="4">Asymptomatic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Fasting Blood Sugar</label>
                  <select
                    name="fbs"
                    value={formData.fbs}
                    onChange={handleChange}
                    className="glass-input w-full"
                    required
                  >
                    <option value="0">≤ 120 mg/dl</option>
                    <option value="1">&gt; 120 mg/dl</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Rest ECG</label>
                  <select
                    name="restecg"
                    value={formData.restecg}
                    onChange={handleChange}
                    className="glass-input w-full"
                    required
                  >
                    <option value="0">Normal</option>
                    <option value="1">ST-T Wave Abnormality</option>
                    <option value="2">Left Ventricular Hypertrophy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Exercise Angina</label>
                  <select
                    name="exang"
                    value={formData.exang}
                    onChange={handleChange}
                    className="glass-input w-full"
                    required
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Slope</label>
                  <select
                    name="slope"
                    value={formData.slope}
                    onChange={handleChange}
                    className="glass-input w-full"
                    required
                  >
                    <option value="1">Upsloping</option>
                    <option value="2">Flat</option>
                    <option value="3">Downsloping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm">CA (Vessels)</label>
                  <select
                    name="ca"
                    value={formData.ca}
                    onChange={handleChange}
                    className="glass-input w-full"
                    required
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Thal</label>
                  <select
                    name="thal"
                    value={formData.thal}
                    onChange={handleChange}
                    className="glass-input w-full"
                    required
                  >
                    <option value="0">Normal</option>
                    <option value="1">Fixed Defect</option>
                    <option value="2">Reversible Defect</option>
                    <option value="3">Unknown</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={predictionMutation.isPending}
                className="glass-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {predictionMutation.isPending ? 'Analyzing...' : 'Run Prediction'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <HeartPulse className="text-blue-400" />
              Prediction Results
            </h2>

            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className={`p-6 bg-gradient-to-r ${getRiskColor(result.risk_level)} rounded-xl`}>
                  <div className="text-center">
                    <p className="text-white/80 text-sm mb-2">Risk Level</p>
                    <p className="text-4xl font-bold text-white mb-4">
                      {result.risk_level.replace('_', ' ').toUpperCase()}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <p className="text-white/80 text-xs">Risk Probability</p>
                        <p className="text-2xl font-bold text-white">
                          {(result.risk_probability * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="h-12 w-px bg-white/30" />
                      <div className="text-center">
                        <p className="text-white/80 text-xs">Confidence</p>
                        <p className="text-2xl font-bold text-white">
                          {(result.confidence_score * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-yellow-400" />
                    Contributing Factors
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(result.contributing_factors).slice(0, 5).map(([factor, value]) => (
                      <div key={factor} className="flex items-center gap-3">
                        <span className="text-white/70 w-32 capitalize">{factor.replace('_', ' ')}</span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            style={{ width: `${value * 100}%` }}
                          />
                        </div>
                        <span className="text-white font-semibold w-12 text-right">{(value * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-white/50">
                <HeartPulse className="mx-auto mb-4 opacity-50" size={48} />
                <p>Enter patient vitals and run prediction to see results</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default Prediction
