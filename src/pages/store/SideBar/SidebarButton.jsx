import React from "react";
import { NavLink } from "react-router-dom";

export default function SidebarButton({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-[#312e81] text-white"
            : "text-indigo-100/70 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}