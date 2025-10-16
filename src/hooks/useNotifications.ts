import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/notificationStore.js";
import { useAuthStore } from "@/store/authStore.js";
import { usePaymentStore } from "@/store/paymentStore.js";
import type { Notification } from "@/types/index.js";

let socket: Socket | null = null;

export function useNotifications(openTransactionModal: () => void) {
  const { addNotification } = useNotificationStore();
  const { selectPayment, selectTransaction, fetchPayments, selectedPayment } =
    usePaymentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id) return;

    socket = io(import.meta.env.VITE_WS_URL ?? "http://localhost:3000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Conectado al WebSocket con ID:", socket?.id);
      socket?.emit("join", user.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión WS:", err.message);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Desconectado del WebSocket");
    });

    socket.on("notification", (payload: any) => {
      console.log("📩 Notificación recibida:", payload);
      addNotification(payload.notification);
      fetchPayments();
      if (selectedPayment && payload.payment?.id === selectedPayment.id) {
        selectPayment(payload.payment);
      }

      toast.info(payload.notification.title, {
        description: payload.notification.content,
        action: {
          label: "Ver",
          onClick: () => {
            if (payload.payment) selectPayment(payload.payment);
            if (payload.paymentTransaction)
              selectTransaction(payload.paymentTransaction);

            openTransactionModal();
          },
        },
        duration: 7000,
      });
    });

    return () => {
      socket?.disconnect();
    };
  }, [
    user?.id,
    addNotification,
    selectPayment,
    selectTransaction,
    openTransactionModal,
  ]);
}
