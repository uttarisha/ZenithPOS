import React from "react";
import CustomerSearch from "./CustomerSearch";
import CustomerCard from "./CustomerCard";

export default function CustomerList({
  customers,
  selectedId,
  onSelectCustomer,
  search,
  setSearch,
  onAddNew,
}) {
  return (
    <div className="w-full lg:w-96 flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <CustomerSearch search={search} setSearch={setSearch} onAddNew={onAddNew} />
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {customers.map((cust) => (
          <CustomerCard
            key={cust.id}
            customer={cust}
            isSelected={selectedId === cust.id}
            onClick={() => onSelectCustomer(cust.id)}
          />
        ))}
        {customers.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            No customers found
          </div>
        )}
      </div>
    </div>
  );
}