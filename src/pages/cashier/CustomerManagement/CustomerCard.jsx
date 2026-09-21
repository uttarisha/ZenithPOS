import React from "react";
import { User } from "lucide-react";

export default function CustomerCard({ customer, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center bg-white hover:border-[#312e81] ${
        isSelected ? "border-[#312e81] ring-1 ring-[#312e81] bg-indigo-50/40" : "border-slate-200"
      }`}
    >
      <div className="space-y-1">
        <h3 className="font-bold text-slate-800 text-sm">{customer.name}</h3>
        <p className="text-xs text-slate-500">{customer.email}</p>
        <p className="text-xs text-slate-400 font-mono">{customer.phone}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-indigo-100 text-[#312e81] flex items-center justify-center shrink-0">
        <User className="w-4 h-4" />
      </div>
    </div>
  );
}