import { create } from 'zustand'

const useUIStore = create((set) => ({
  sidebarOpen: true,
  toast: null,
  modalOpen: false,
  modalContent: null,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),
}))

export default useUIStore
