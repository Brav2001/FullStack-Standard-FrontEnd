import { useEffect, useState } from "react";
import { usePaymentStore } from "@/store/paymentStore.js";
import { Badge } from "@/components/ui/badge.js";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { cn } from "@/lib/utils.js";
import { Loader2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.js";
import { Calendar } from "@/components/ui/calendar.js";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card.js";
import { Separator } from "@/components/ui/separator.js";

export const PaymentList = ({ toggleList = () => {} }) => {
  const {
    payments,
    total,
    loading,
    fetchPayments,
    selectPayment,
    selectedPayment,
    setFilter,
    setPage,
    setStatus,
    setAmountMin,
    setAmountMax,
    setDateFrom,
    setDateTo,
  } = usePaymentStore();

  const [filterInput, setFilterInput] = useState("");
  const [pageInput, setPageInput] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const pageSize = 10;

  useEffect(() => {
    setFilter(filterInput);
    setPage(pageInput);
    setStatus(statusFilter);
    setAmountMin(minAmount);
    setAmountMax(maxAmount);
    setDateFrom(dateRange.from ? dateRange.from.toISOString() : "");
    setDateTo(dateRange.to ? dateRange.to.toISOString() : "");
    fetchPayments();
  }, [filterInput, pageInput, statusFilter, minAmount, maxAmount, dateRange]);

  const totalPages = Math.ceil(total / pageSize);

  const toggleStatus = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div className="space-y-5">
      <Card className="p-4 space-y-4 border-border bg-muted/30">
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Buscar descripción..."
            value={filterInput}
            onChange={(e) => {
              setPageInput(1);
              setFilterInput(e.target.value);
            }}
            className="max-w-xs"
          />

          <Select onValueChange={toggleStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar estado" />
            </SelectTrigger>
            <SelectContent>
              {["CREATED", "PAID", "CANCELED", "EXPIRED"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {statusFilter.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {statusFilter.map((s) => (
                <Badge
                  key={s}
                  variant={s as any}
                  className="cursor-pointer text-xs px-2"
                  onClick={() => toggleStatus(s)}
                >
                  {s} ✕
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full"
            />
            <span className="text-muted-foreground">—</span>
            <Input
              type="number"
              placeholder="Máx"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="w-full"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {dateRange.from
                  ? `${format(dateRange.from, "dd/MM/yyyy", { locale: es })}${
                      dateRange.to
                        ? " - " +
                          format(dateRange.to, "dd/MM/yyyy", { locale: es })
                        : ""
                    }`
                  : "Seleccionar fechas"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dateRange as any}
                onSelect={setDateRange as any}
                numberOfMonths={2}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : payments.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">
          No hay pagos disponibles.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {payments.map((payment) => (
            <div
              key={payment.id}
              onClick={() => {
                selectPayment(payment);
                toggleList();
              }}
              className={cn(
                "cursor-pointer p-3 rounded-lg border bg-background transition hover:bg-muted",
                selectedPayment?.id === payment.id && "bg-muted border-primary"
              )}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{payment.description}</p>
                  <p className="text-sm text-muted-foreground">
                    ${payment.amount.toLocaleString("es-CO")}
                  </p>
                </div>
                <Badge variant={payment.status as any}>{payment.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            disabled={pageInput === 1}
            onClick={() => setPageInput((prev) => prev - 1)}
          >
            Anterior
          </Button>
          <p className="text-sm text-muted-foreground">
            Página {pageInput} de {totalPages}
          </p>
          <Button
            variant="outline"
            disabled={pageInput === totalPages}
            onClick={() => setPageInput((prev) => prev + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};
