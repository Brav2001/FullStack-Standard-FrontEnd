import { useAuthStore } from "@/store/authStore.js";
import { authApi } from "@/api/authApi.js";

export const useAuth = () => {
  const { login, logout, user, accessToken, refreshToken } = useAuthStore();

  const loginUser = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    login(data.data.accessToken, data.data.refreshToken, data.data.user);
  };

  return { user, accessToken, refreshToken, loginUser, logout };
};
