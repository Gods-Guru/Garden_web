import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  MapPin,
  Calendar,
  CheckSquare,
  Droplets,
  MessageSquare,
  Trophy,
  FileText,
  Settings,
  Bell,
  BarChart3,
  Sprout
} from "lucide-react";

const adminNavItems = [
  { title: "Overview", url: "/admin", icon: Home },
  { title: "Gardens", url: "/admin/gardens", icon: Sprout },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Plots", url: "/admin/plots", icon: MapPin },
  { title: "Tasks", url: "/admin/tasks", icon: CheckSquare },
  { title: "Events", url: "/admin/events", icon: Calendar },
  { title: "Forum", url: "/admin/forum", icon: MessageSquare },
  { title: "Water Logs", url: "/admin/water", icon: Droplets },
  { title: "Achievements", url: "/admin/achievements", icon: Trophy },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">
            {!collapsed && "Admin Panel"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/admin"} className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}