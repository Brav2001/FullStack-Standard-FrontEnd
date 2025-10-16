import { useEffect, useState } from "react";
import { usePaymentStore } from "@/store/paymentStore.js";
import { PaymentList } from "@/pages/Dashboard/PaymentList.jsx";
import { PaymentDetails } from "@/pages/Dashboard/PaymentDetails.jsx";
import { Button } from "@/components/ui/button.js";
import {
  Settings,
  BarChart,
  Receipt,
  RotateCcw,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications.js";
import { useAuthStore } from "@/store/authStore.js";
import { useNavigate } from "react-router-dom";
import { CreatePaymentModal } from "@/components/organisms/CreatePaymentModal.jsx";
import { PaymentStatsModal } from "@/components/organisms/PaymentStatsModal.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { toast } from "sonner";
import { ViewTransactionModal } from "@/components/organisms/ViewTransactionModal.js";
import { UpdateCredentialsModal } from "@/components/organisms/UpdateCredentialsModal.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { getUserName } from "@/utils/tokenUtils.js";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [openModal, setOpenModal] = useState(false);
  const [openStatsModal, setOpenStatsModal] = useState(false);
  const { selectedPayment, fetchPayments, selectPayment } = usePaymentStore();
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openUpdateCredentialsModal, setOpenUpdateCredentialsModal] =
    useState(false);
  const [showList, setShowList] = useState(null as boolean | null);

  useNotifications(() => setOpenViewModal(true));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const toggleList = () =>
    showList === null ? setShowList(true) : setShowList(false);

  const userName = getUserName();

  return (
    <div className="relative h-screen flex flex-col md:grid md:grid-cols-[350px_1fr] overflow-hidden bg-background">
      <div className="hidden md:block border-r p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pagos</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  fetchPayments();
                  toast.success("Lista de pagos actualizada");
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Actualizar lista de pagos</TooltipContent>
          </Tooltip>
        </div>
        <PaymentList />
      </div>

      <AnimatePresence>
        {showList && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-20 md:hidden"
              onClick={toggleList}
            />
            <motion.div
              key="mobile-list"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-background border-r shadow-lg z-30 p-4 overflow-y-auto md:hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pagos</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        fetchPayments();
                        toast.success("Lista de pagos actualizada");
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Actualizar lista de pagos</TooltipContent>
                </Tooltip>
              </div>
              <PaymentList toggleList={toggleList} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative flex flex-col p-4 md:p-6 gap-4 flex-1 overflow-hidden">
        <div className="flex justify-between items-center sticky top-0 bg-background z-10 pb-2 border-b md:border-none">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleList}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold hidden md:block">
              {userName ? `Bienvenido, ${userName}! 👋` : "Bienvenido! 👋"}
            </h1>
          </div>

          <div className="flex gap-2 ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setOpenStatsModal(true)}
                >
                  <BarChart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ver estadísticas</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setOpenUpdateCredentialsModal(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Configuración</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setOpenModal(true)}
                >
                  <Receipt className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Crear pago</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cerrar sesión</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedPayment ? (
            <motion.div
              key="payment-details"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className="absolute relative inset-0 bg-background z-10 p-4 rounded-md shadow-lg overflow-y-auto"
            >
              <PaymentDetails toggleList={toggleList} />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 items-center justify-center text-muted-foreground"
            >
              Selecciona un pago para ver los detalles.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreatePaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        showList={() =>
          showList === null ? setShowList(null) : setShowList(true)
        }
      />
      <PaymentStatsModal
        open={openStatsModal}
        onClose={() => setOpenStatsModal(false)}
      />
      <ViewTransactionModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
      />
      <UpdateCredentialsModal
        open={openUpdateCredentialsModal}
        onClose={() => setOpenUpdateCredentialsModal(false)}
      />
    </div>
  );
};
