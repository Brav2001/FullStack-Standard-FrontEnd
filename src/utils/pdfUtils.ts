import jsPDF from "jspdf";

export interface PaymentPDFData {
  amount: number;
  description: string;
  due_date: string;
  status: string;
  reference: string;
  cancel_description?: string | null;
}

export function generatePaymentPDF(payment: PaymentPDFData) {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Comprobante de Pago", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  let y = 40;

  doc.text(`Referencia: ${payment.reference}`, 20, y);
  y += 10;
  doc.text(`Descripción: ${payment.description}`, 20, y);
  y += 10;
  doc.text(
    `Monto: $${payment.amount.toLocaleString("es-CO", {
      minimumFractionDigits: 2,
    })}`,
    20,
    y
  );
  y += 10;
  doc.text(`Fecha de vencimiento: ${formatDate(payment.due_date)}`, 20, y);
  y += 10;
  doc.text(`Estado: ${payment.status}`, 20, y);

  if (payment.status === "CANCELED" && payment.cancel_description) {
    y += 10;
    doc.setTextColor(200, 0, 0);
    doc.text(`Motivo de cancelación: ${payment.cancel_description}`, 20, y);
    doc.setTextColor(0, 0, 0);
  }

  y += 20;
  doc.setFontSize(10);
  doc.text(
    "Generado automáticamente por el sistema de pagos PuntoRed",
    105,
    y,
    { align: "center" }
  );

  doc.save(`Comprobante-${payment.reference}.pdf`);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
