import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Browse from "./pages/Browse";
import BusinessDetail from "./pages/BusinessDetail";
import Auth from "./pages/Auth";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/NotFound";
import AddBusiness from "./pages/AddBusiness";
import ManageBusiness from "./pages/ManageBusiness";
import MyBusinessHub from "./pages/MyBusinessHub";
import AdminReviewQueue from "./pages/AdminReviewQueue";
import { RequireBusinessOwner } from "./components/RequireBusinessOwner";
import { RequireAdmin } from "./components/RequireAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import { AdminRoute } from "./components/AdminRoute";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppSidebar />
        <div className="pl-12">
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
            <Route
              path="/business/:id/manage"
              element={
                <RequireBusinessOwner>
                  <ManageBusiness />
                </RequireBusinessOwner>
              }
            />
            <Route
              path="/owner/business"
              element={
                <RequireBusinessOwner>
                  <MyBusinessHub />
                </RequireBusinessOwner>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
