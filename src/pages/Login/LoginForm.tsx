import { useState } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password);
      toast.success("Inicio de sesión exitoso.");
      navigate("/dashboard");
    } catch {
      toast.error("Error al iniciar sesión. Revisa tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>

      <Input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Iniciando..." : "Iniciar sesión"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <span
          className="text-primary cursor-pointer hover:underline"
          onClick={() => navigate("/register")}
        >
          Regístrate
        </span>
      </p>
    </form>
  );
};
