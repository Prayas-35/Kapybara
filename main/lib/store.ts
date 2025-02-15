import { create } from "zustand"

type ModalStore = {
  isOpen: boolean
  selectedDateTime: Date | null
  openModal: (dateTime: Date) => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  selectedDateTime: null,
  openModal: (dateTime) => set({ isOpen: true, selectedDateTime: dateTime }),
  closeModal: () => set({ isOpen: false, selectedDateTime: null }),
}))
