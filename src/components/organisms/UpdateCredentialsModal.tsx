import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { Label } from "@/components/ui/label.js";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance.js";

interface Props {
  open: boolean;
  onClose: () => void;
  provider?: string;
}

export function UpdateCredentialsModal({
  open,
  onClose,
  provider = "PuntoRed",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrorMsg(null);
    setLoading(true);

    axiosInstance
      .get(`/payment-provider/credentials-config?provider=${provider}`)
      .then((res) => {
        setForm(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 422 || err.response?.status === 409) {
          setErrorMsg(
            err.response.data?.message ?? "Error al cargar credenciales"
          );
        } else {
          toast.error("Error al obtener configuración del proveedor");
        }
      })
      .finally(() => setLoading(false));
  }, [open, provider]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    toast.promise(
      axiosInstance.patch(
        `/payment-provider/credentials-schema-update/${provider}`,
        {
          ...form,
        }
      ),
      {
        loading: "Actualizando credenciales...",
        success: "Credenciales actualizadas correctamente",
        error: (err) =>
          err.response?.data?.message ?? "Error al actualizar las credenciales",
      }
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar credenciales</DialogTitle>
          <DialogDescription>
            Modifica las credenciales para conectarte con {provider}.
          </DialogDescription>
        </DialogHeader>

        {errorMsg ? (
          <div className="p-4 border border-destructive rounded-md bg-destructive/10 text-destructive text-sm">
            {errorMsg}
          </div>
        ) : loading ? (
          <p className="text-center text-muted-foreground py-4">
            Cargando configuración...
          </p>
        ) : (
          <div className="space-y-3 mt-3">
            {Object.entries(form).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <Label htmlFor={key} className="mb-2 font-medium">
                  {key}
                </Label>
                <Input
                  id={key}
                  name={key}
                  value={value as string}
                  onChange={handleChange}
                  type="password"
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="mt-4">
          {!errorMsg && (
            <Button onClick={handleSubmit} disabled={loading}>
              Guardar cambios
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateCredentialsModal;
