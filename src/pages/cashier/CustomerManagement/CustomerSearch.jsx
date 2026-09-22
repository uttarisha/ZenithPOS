import React from "react";
import { Search, Plus } from "lucide-react";

export default function CustomerSearch({ search, setSearch, onAddNew }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Customers..."
          className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#312e81]"
        />
      </div>
      <button
        onClick={onAddNew}
        className="flex items-center gap-1 px-3 py-2 bg-[#312e81] hover:bg-[#1e1b4b] text-white text-xs font-semibold rounded-lg transition-colors shrink-0 shadow-sm"
      >
        <Plus className="h-4 w-4" /> Add New
      </button>
    </div>
  );
}