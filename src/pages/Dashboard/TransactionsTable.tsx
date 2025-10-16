import { usePaymentStore } from "@/store/paymentStore.js";
import ViewTransactionModal from "@/components/organisms/ViewTransactionModal.js";
import { useState } from "react";

interface Transaction {
  id: string;
  amount: number;
  status: string;
  payment_date: string;
}

export const TransactionsTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const [open, setOpen] = useState(false);
  const { selectTransaction } = usePaymentStore();

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-2">Fecha</th>
            <th className="p-2">Monto</th>
            <th className="p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-t hover:bg-muted/50 cursor-pointer"
              onClick={() => {
                selectTransaction(t);
                setOpen(true);
              }}
            >
              <td className="p-2">
                {new Date(t.payment_date).toLocaleString()}
              </td>
              <td className="p-2">${t.amount}</td>
              <td className="p-2">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ViewTransactionModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};
