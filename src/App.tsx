import { AppRouter } from "@/routes/AppRouter.jsx";
import { ThemeProvider } from "@/components/theme-provider.jsx";
import { Toaster } from "@/components/ui/sonner.jsx";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRouter />
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}

export default App;
