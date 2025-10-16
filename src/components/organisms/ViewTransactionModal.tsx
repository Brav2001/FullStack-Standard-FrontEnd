import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { usePaymentStore } from "@/store/paymentStore.js";
import { Badge } from "../ui/badge.jsx";

interface ViewTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

export function ViewTransactionModal({
  open,
  onClose,
}: ViewTransactionModalProps) {
  const { selectedTransaction: transaction } = usePaymentStore();
  if (!transaction) return null;

  const formattedDate = new Date(transaction.payment_date).toLocaleString(
    "es-CO",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle de Transacción</DialogTitle>
          <DialogDescription>
            Información detallada sobre el pago realizado.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-100">
              ID de Transacción:
            </span>
            <span className="font-mono text-gray-300 text-right">
              {transaction.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-100">Monto:</span>
            <span className="text-gray-300 font-semibold">
              $
              {transaction.amount.toLocaleString("es-CO", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-100">Estado:</span>
            <Badge variant={transaction.status as any}>
              {transaction.status}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-100">Fecha de Pago:</span>
            <span className="text-gray-300">{formattedDate}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewTransactionModal;
