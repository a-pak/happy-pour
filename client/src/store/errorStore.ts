import { create } from 'zustand';
export type AlertType = 'error' | 'success' | 'info' | 'warning';

type Notification = {
  message: string;
  type: AlertType;
};

type ErrorState = {
  notification: Notification | null;
  showNotification: (message: string, type?: AlertType) => void;
  clearNotification: () => void;
};

export const useErrorStore = create<ErrorState>((set) => ({
  notification: null,
  showNotification: (message, type = 'error') =>
    set({ notification: { message, type } }),
  clearNotification: () => set({ notification: null }),
}));