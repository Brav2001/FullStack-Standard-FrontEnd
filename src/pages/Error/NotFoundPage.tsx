import { motion } from "framer-motion";
import { Button } from "@/components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6 bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md"
      >
        <h1 className="text-8xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Ups... la página que estás buscando no existe o fue movida.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={() => navigate("/dashboard")} className="gap-2">
            <Home className="h-4 w-4" />
            Volver al Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
