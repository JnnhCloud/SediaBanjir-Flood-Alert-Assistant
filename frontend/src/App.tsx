import React from "react";
<<<<<<< HEAD
=======
import { Toaster } from "sonner"; // Make sure you run: npm install sonner
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> 6647c9ad590f2a68beb4af9fa7bcb10be892e574
import Index from "./pages/Index";

function App() {
  return <Index />;
}

<<<<<<< HEAD
=======
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Notification toaster */}
      <Toaster />
      
      {/* React Router */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

>>>>>>> 6647c9ad590f2a68beb4af9fa7bcb10be892e574
export default App;