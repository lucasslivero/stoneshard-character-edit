import { Router } from '@app/router';
import { Toaster } from '@shadcn/sonner';
import { ThemeProvider } from '@ui/contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
