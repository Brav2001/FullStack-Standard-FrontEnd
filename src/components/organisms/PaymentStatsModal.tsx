import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance.js";
import { Loader2 } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#ef4444"];

interface PaymentStats {
  CREATED: number;
  PAID: number;
  CANCELED: number;
}

interface PaymentStatsModalProps {
  open: boolean;
  onClose: () => void;
}

export function PaymentStatsModal({ open, onClose }: PaymentStatsModalProps) {
  const [data, setData] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/payment/data-count");
        setData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar las métricas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

  const chartData = data
    ? [
        { name: "Creados", value: data.CREATED },
        { name: "Pagados", value: data.PAID },
        { name: "Cancelados", value: data.CANCELED },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Estadísticas de Pagos
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : data ? (
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    className="cursor-pointer"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full text-center">
              <div>
                <p className="text-sm text-muted-foreground">Creados</p>
                <p className="font-bold text-blue-500">{data.CREATED}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagados</p>
                <p className="font-bold text-green-500">{data.PAID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cancelados</p>
                <p className="font-bold text-red-500">{data.CANCELED}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No hay datos disponibles
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
