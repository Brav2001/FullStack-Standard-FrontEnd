import { useState } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance.js";
import { toast } from "sonner";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        last_name: form.last_name,
        phone: form.phone,
        email: form.email,
        password: form.password,
      };

      const res = await axiosInstance.post("/user", payload);

      if (res.status === 201) {
        toast.success("Cuenta creada correctamente. Iniciando sesión...");
        await loginUser(form.email, form.password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al crear la cuenta";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 max-w-sm mx-auto bg-background rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center">Crear cuenta</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          name="last_name"
          placeholder="Apellido"
          value={form.last_name}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        name="phone"
        placeholder="Teléfono"
        value={form.phone}
        onChange={handleChange}
        required
      />
      <Input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={form.email}
        onChange={handleChange}
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        required
      />
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirmar contraseña"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creando cuenta..." : "Registrarse"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <span
          className="text-primary cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Inicia sesión
        </span>
      </p>
    </form>
  );
};

export default RegisterForm;
