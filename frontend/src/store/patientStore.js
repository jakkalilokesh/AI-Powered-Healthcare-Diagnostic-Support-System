import { create } from 'zustand'

const usePatientStore = create((set) => ({
  patients: [],
  selectedPatient: null,
  isLoading: false,
  
  setPatients: (patients) => set({ patients }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  setLoading: (isLoading) => set({ isLoading }),
  addPatient: (patient) => set((state) => ({ patients: [...state.patients, patient] })),
  updatePatient: (updatedPatient) => set((state) => ({
    patients: state.patients.map((p) => p.id === updatedPatient.id ? updatedPatient : p),
    selectedPatient: state.selectedPatient?.id === updatedPatient.id ? updatedPatient : state.selectedPatient,
  })),
  removePatient: (patientId) => set((state) => ({
    patients: state.patients.filter((p) => p.id !== patientId),
    selectedPatient: state.selectedPatient?.id === patientId ? null : state.selectedPatient,
  })),
}))

export default usePatientStore
