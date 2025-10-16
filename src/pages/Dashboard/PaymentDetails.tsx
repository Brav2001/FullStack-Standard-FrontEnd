import { useState } from "react";
import { usePaymentStore } from "@/store/paymentStore.js";
import { Badge } from "@/components/ui/badge.js";
import { FileDown, CircleX, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { TransactionsTable } from "@/pages/Dashboard/TransactionsTable.jsx";
import CancelPaymentModal from "@/components/organisms/CancelPaymentModal.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { toast } from "sonner";
import { generatePaymentPDF, type PaymentPDFData } from "@/utils/pdfUtils.js";

export const PaymentDetails = ({ toggleList = () => {} }) => {
  const [openModal, setOpenModal] = useState(false);
  const { selectedPayment, selectPayment } = usePaymentStore();

  if (!selectedPayment) return null;

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Detalle del pago</h3>
        <div className="flex items-center gap-2">
          <Badge variant={selectedPayment.status as any}>
            {selectedPayment.status}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  generatePaymentPDF(selectedPayment as PaymentPDFData);
                  toast.success("Descarga iniciada");
                }}
              >
                <FileDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Descargar cobro</p>
            </TooltipContent>
          </Tooltip>
          {selectedPayment.status === "CREATED" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setOpenModal(true)}>
                  <CircleX className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cancelar pago</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  selectPayment(null);
                  toggleList();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cerrar detalle del pago</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="rounded-md border p-4">
        <p>
          <strong>Descripción:</strong> {selectedPayment.description}
        </p>
        <p>
          <strong>Monto:</strong> ${selectedPayment.amount.toLocaleString()}
        </p>
        <p>
          <strong>Referencia:</strong> {selectedPayment.reference}{" "}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(selectedPayment.reference);
                  toast.success("Referencia copiada al portapapeles");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copiar referencia</p>
            </TooltipContent>
          </Tooltip>
        </p>
        <p>
          <strong>Fecha de creación:</strong>{" "}
          {new Date(selectedPayment.created_at).toLocaleString()}
        </p>
        {selectedPayment.due_date && (
          <p>
            <strong>Fecha de vencimiento:</strong>{" "}
            {new Date(selectedPayment.due_date).toLocaleString()}
          </p>
        )}
        {selectedPayment.cancel_description && (
          <p>
            <strong>Razón de cancelación:</strong>{" "}
            {selectedPayment.cancel_description}
          </p>
        )}
      </div>

      <div>
        <h4 className="font-semibold mb-2">Transacciones</h4>
        <TransactionsTable
          transactions={selectedPayment.paymentTransactions || []}
        />
      </div>
      <CancelPaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};
