import axiosInstance from "@/utils/axiosInstance.js";
import type { Notification } from "@/types/index.js";

export const notificationApi = {
  getAll: async (): Promise<Notification[]> => {
    const res = await axiosInstance.get("/notifications");
    return res.data;
  },
};
