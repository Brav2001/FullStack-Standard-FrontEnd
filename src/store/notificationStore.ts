import { create } from "zustand";
import type { Notification } from "@/types/index.js";
import { notificationApi } from "@/api/notificationApi.js";

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => {
  return {
    notifications: [],
    isLoading: false,
    error: null,

    fetchNotifications: async () => {
      try {
        set({ isLoading: true });
        const data = await notificationApi.getAll();
        set({ notifications: data, isLoading: false });
      } catch (err: any) {
        set({ error: err.message, isLoading: false });
      }
    },

    addNotification: (notification) =>
      set((state) => ({
        notifications: [notification, ...state.notifications],
      })),

    clearNotifications: () => set({ notifications: [] }),
  };
});
