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
}

export function CancelPaymentModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    description: "",
  });

  const { fetchPayments, selectedPayment } = usePaymentStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      id: selectedPayment?.id,
      reason: form.description,
    };

    toast.promise(axiosInstance.put("/payment/cancel", payload), {
      loading: "Cancelando pago...",
      success: (res) => {
        onClose();
        setForm({ description: "" });
        fetchPayments();
        onClose();
        return `Pago cancelado correctamente (ref: ${selectedPayment?.reference})`;
      },
      error: (err) =>
        err.response?.data?.message ?? "Error al cancelar el pago",
    });
  };

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar pago</DialogTitle>
          <DialogDescription>
            Proporcione una razón para cancelar el pago.
          </DialogDescription>
          <DialogDescription className="mt-2">
            <strong>Referencia:</strong> {selectedPayment?.reference}
          </DialogDescription>
        </DialogHeader>
        <DialogHeader>
          <DialogDescription className="mb-4">
            <strong>Monto:</strong> ${selectedPayment?.amount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            type="text"
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Cancelar pago</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CancelPaymentModal;
