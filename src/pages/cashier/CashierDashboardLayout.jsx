import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar/SidebarButton";
import { Outlet } from "react-router-dom";
import { ShoppingCart, Clock, RotateCcw, ReceiptIcon, Users, Menu } from "lucide-react";
import { getBranchByIdApi } from "@/lib/branchApi";
import useMyBranch from "@/lib/useMyBranch";

const navItems = [
  { path: "/cashier", icon: <ShoppingCart size={20} />, label: "Create Order" },
  { path: "/cashier/orders", icon: <Clock size={20} />, label: "Order History" },
  { path: "/cashier/customers", icon: <Users size={20} />, label: "Customers" },
  { path: "/cashier/returns", icon: <RotateCcw size={20} />, label: "Returns" },
  { path: "/cashier/shift", icon: <ReceiptIcon size={20} />, label: "Shift Summary" },
];

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const CashierDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { branchId } = useMyBranch();
  const user = readUser();
  const [branch, setBranch] = useState(null);

  useEffect(() => {
    if (!branchId) {
      setBranch(null);
      return;
    }

    let active = true;
    getBranchByIdApi(branchId)
      .then((data) => {
        if (active) setBranch(data);
      })
      .catch(() => {
        if (active) setBranch(null);
      });

    return () => {
      active = false;
    };
  }, [branchId]);

  return (
    <div className="flex flex-col h-screen bg-indigo-50 font-sans overflow-hidden">
      <header className="h-14 bg-indigo-950 border-b border-indigo-900 px-4 flex items-center justify-between shrink-0 text-white z-10 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-800 text-indigo-200 transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-base tracking-wide">ZenithPOS</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-indigo-300">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              branchId ? "bg-sky-400" : "bg-amber-400"
            }`}
          ></span>
          <span>
            {branchId ? branch?.name || "Loading branch..." : "No branch assigned"}
          </span>
          {user?.fullName && (
            <span className="hidden sm:inline text-indigo-400">· {user.fullName}</span>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-indigo-950/60 z-20 transition-opacity"
          />
        )}

        <div
          className={`fixed left-0 top-0 bottom-0 z-30 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            navItems={navItems}
            onClose={() => setSidebarOpen(false)}
            branch={branch}
            user={user}
          />
        </div>

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-indigo-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CashierDashboardLayout;