import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Gardens from "./pages/Gardens";
import Plots from "./pages/Plots";
import Tasks from "./pages/Tasks";
import Plants from "./pages/Plants";
import Water from "./pages/Water";
import Achievements from "./pages/Achievements";
import Forum from "./pages/Forum";
import Events from "./pages/Events";
import Members from "./pages/Members";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminGardens from "./pages/admin/AdminGardens";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlots from "./pages/admin/AdminPlots";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminForum from "./pages/admin/AdminForum";
import AdminWater from "./pages/admin/AdminWater";
import AdminAchievements from "./pages/admin/AdminAchievements";
import AdminReports from "./pages/admin/AdminReports";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gardens" element={<Gardens />} />
          <Route path="/plots" element={<Plots />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/water" element={<Water />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/events" element={<Events />} />
          <Route path="/members" element={<Members />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/gardens" element={<AdminGardens />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/plots" element={<AdminPlots />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/forum" element={<AdminForum />} />
          <Route path="/admin/water" element={<AdminWater />} />
          <Route path="/admin/achievements" element={<AdminAchievements />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
