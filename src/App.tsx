import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import BusinessDetail from "./pages/BusinessDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AddBusiness from "./pages/AddBusiness";
// Admin-only page that surfaces the verification review queue.
import AdminReviewQueue from "./pages/AdminReviewQueue";
import { RequireBusinessOwner } from "./components/RequireBusinessOwner";
// Route guard that restricts access to users with the admin role.
import { RequireAdmin } from "./components/RequireAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/business/:id" element={<BusinessDetail />} />
          <Route
            path="/business/add"
            element={
              <RequireBusinessOwner>
                <AddBusiness />
              </RequireBusinessOwner>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/admin/review"
            element={
              <RequireAdmin>
                <AdminReviewQueue />
              </RequireAdmin>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
