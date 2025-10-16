import { create } from "zustand";
import axiosInstance from "@/utils/axiosInstance.js";
import { toast } from "sonner";

export interface Payment {
  id: string;
  amount: number;
  description: string;
  status: string;
  reference: string;
  due_date?: string;
  created_at: string;
  cancel_description?: string;
  paymentTransactions?: {
    id: string;
    amount: number;
    status: string;
    payment_date: string;
  }[];
}

export interface Transaction {
  id: string;
  amount: number;
  status: string;
  payment_date: string;
}

interface PaymentState {
  payments: Payment[];
  total: number;
  selectedPayment: Payment | null;
  selectedTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
  filter: string;
  page: number;
  status: string[];
  amountMin: string;
  amountMax: string;
  dateFrom?: string;
  dateTo?: string;
  fetchPayments: () => Promise<void>;
  selectPayment: (payment: Payment | null) => void;
  selectTransaction: (transaction: Transaction) => void;
  setFilter: (filter: string) => void;
  setPage: (page: number) => void;
  setStatus: (status: string[]) => void;
  setAmountMin: (amount: string) => void;
  setAmountMax: (amount: string) => void;
  setDateFrom: (date: string | undefined) => void;
  setDateTo: (date: string | undefined) => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  total: 0,
  selectedPayment: null,
  selectedTransaction: null,
  loading: false,
  error: null,
  filter: "",
  page: 1,
  status: [],
  amountMin: "",
  amountMax: "",
  dateFrom: "",
  dateTo: "",

  fetchPayments: async () => {
    try {
      const { filter, page, status, amountMin, amountMax, dateFrom, dateTo } =
        get();
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `/payment?filter=${filter}&page=${page}&status=${status.join(
          ","
        )}&amountMin=${amountMin}&amountMax=${amountMax}&dateFrom=${
          dateFrom || ""
        }&dateTo=${dateTo || ""}`
      );
      set({
        payments: response.data.payments,
        loading: false,
        total: response.data.total,
      });
    } catch (error: unknown) {
      console.error("Error fetching payments:", error);
      toast.error("Error al cargar los pagos.");
      set({ loading: false, error: "Error fetching payments" });
    }
  },

  selectPayment: (payment) => {
    set({ selectedPayment: payment });
  },

  selectTransaction: (transaction) => {
    set({ selectedTransaction: transaction });
  },

  setFilter: (filter: string) => set({ filter: filter }),
  setPage: (page: number) => set({ page: page }),
  setStatus: (status: string[]) => set({ status: status }),
  setAmountMin: (amount: string) => set({ amountMin: amount }),
  setAmountMax: (amount: string) => set({ amountMax: amount }),
  setDateFrom: (date: string) => set({ dateFrom: date }),
  setDateTo: (date: string) => set({ dateTo: date }),
}));
