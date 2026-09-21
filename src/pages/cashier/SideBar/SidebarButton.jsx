import React from "react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, MapPin, LogOut, User } from "lucide-react";

const Sidebar = ({ navItems = [], onClose, branch, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const ok = window.confirm(
      "Log out of your account?\n\nIf you have a shift running, it stays open. " +
        'To close it, use "End Shift & Logout" on the Shift Summary page.'
    );
    if (!ok) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-64 border-r border-indigo-900 bg-indigo-950 text-indigo-100 p-4 flex flex-col h-full relative shadow-xl">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 border-b border-indigo-900 mb-4">
        <div>
          <h1 className="text-xl font-black tracking-wider text-white">ZenithPOS</h1>
          <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">
            Retail System
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-indigo-400 hover:text-white hover:bg-indigo-900"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.path}
            to={item.path}
            end={item.path === "/cashier"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-900 text-white font-bold border-l-4 border-sky-400 shadow-sm"
                  : "text-indigo-400 hover:bg-indigo-900/60 hover:text-indigo-100"
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </RouterNavLink>
        ))}
      </nav>

      {/* Footer: branch, account, logout */}
      <div className="pt-4 border-t border-indigo-900 mt-auto space-y-3">
        <div className="px-3 py-2.5 bg-indigo-900/80 rounded-lg space-y-1">
          {branch ? (
            <>
              <p className="text-xs font-bold text-indigo-200">{branch.name}</p>
              {branch.address && (
                <div className="flex items-start gap-1 text-[11px] text-indigo-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs font-bold text-amber-300">No branch assigned yet</p>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-2 px-1 text-indigo-300">
            <User className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{user.fullName || "Cashier"}</p>
              <p className="text-[10px] text-indigo-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/20 hover:text-red-200 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;