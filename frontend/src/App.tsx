import React from "react";
import { Toaster } from "sonner"; // Make sure you run: npm install sonner
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

const queryClient = new QueryClient();

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

export default App;