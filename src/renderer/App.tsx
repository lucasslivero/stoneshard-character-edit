import { Toaster } from "@shadcn/sonner";
import { ThemeProvider } from "@ui/contexts/ThemeContext";
import { Home } from "./ui/layouts/home";
import { MainLayout } from "./ui/layouts/MainLayout";

function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <Home />
      </MainLayout>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
