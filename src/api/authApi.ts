import api from "@/utils/axiosInstance.js";

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/access/login", { email, password }),
  refreshToken: (refreshToken: string) =>
    api.post("/access/refresh-token", { refreshToken }),
};
