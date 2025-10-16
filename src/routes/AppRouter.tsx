import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/Login/LoginPage.js";
import { DashboardPage } from "@/pages/Dashboard/DashboardPage.jsx";
import { RegisterPage } from "@/pages/Register/RegisterPage.jsx";
import { NotFoundPage } from "@/pages/Error/NotFoundPage.jsx";
import { useAuthStore } from "@/store/authStore.js";

export const AppRouter = () => {
  const { accessToken } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={accessToken ? <DashboardPage /> : <Navigate to="/login" />}
        />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
