import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.js";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance.js";
import { usePaymentStore } from "@/store/paymentStore.js";

interface Props {
  open: boolean;
  onClose: () => void;
  showList: () => void;
}

export function CreatePaymentModal({ open, onClose, showList }: Props) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    dueDate: "",
  });

  const { fetchPayments } = usePaymentStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatDateForBackend = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  };

  const handleSubmit = async () => {
    const payload = {
      amount: parseFloat(form.amount),
      description: form.description,
      dueDate: formatDateForBackend(form.dueDate),
    };

    toast.promise(axiosInstance.post("/payment", payload), {
      loading: "Creando pago...",
      success: (res) => {
        onClose();
        setForm({ amount: "", description: "", dueDate: "" });
        fetchPayments();
        onClose();
        showList();
        return `Pago creado correctamente (ref: ${res.data.reference})`;
      },
      error: (err) => err.response?.data?.message ?? "Error al crear el pago",
    });
  };

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo pago</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Completa el siguiente formulario para crear un nuevo pago.
        </DialogDescription>

        <div className="space-y-3">
          <Input
            type="number"
            name="amount"
            placeholder="Monto (COP)"
            value={form.amount}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            type="datetime-local"
            name="dueDate"
            min={minDate}
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Crear pago</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CreatePaymentModal;
