import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GitBranch,
  Package,
  Users,
  User,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import SidebarButton from "./SideBar/SidebarButton";

const navItems = [
  { to: "/store/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/store/branches", label: "Branches", icon: GitBranch },
  { to: "/store/catalog", label: "Catalog", icon: Package },
  { to: "/store/employees", label: "Employees", icon: Users },
  { to: "/store/profile", label: "Profile", icon: User },
];

export default function StoreDashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50/50">
      <aside className="w-64 bg-[#1e1b4b] text-white flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">ZenithPOS</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <SidebarButton key={item.to} {...item} />
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-3">
          <div className="px-3">
            <p className="text-sm font-semibold text-white truncate">
              {user?.fullName || "Store Admin"}
            </p>
            <p className="text-xs text-indigo-100/50 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-100/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}