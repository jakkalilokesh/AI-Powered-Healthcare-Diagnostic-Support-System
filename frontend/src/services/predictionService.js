import api from './api'

export const predictionService = {
  createPrediction: async (predictionData) => {
    const response = await api.post('/predictions/', predictionData)
    return response.data
  },

  getPatientPredictions: async (patientId, params = {}) => {
    const response = await api.get(`/predictions/patient/${patientId}`, { params })
    return response.data
  },

  getPrediction: async (id) => {
    const response = await api.get(`/predictions/${id}`)
    return response.data
  },
}
