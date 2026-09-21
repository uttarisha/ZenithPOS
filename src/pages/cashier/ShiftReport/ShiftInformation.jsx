import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(start, end) {
  if (!start) return "—";
  const startTime = new Date(start);
  const endTime = end ? new Date(end) : new Date();
  const diffMs = Math.max(0, endTime - startTime);
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${mins}m`;
}

export default function ShiftInformation({ shift }) {
  return (
    <Card className="h-full shadow-sm border border-gray-200 bg-white">
      <CardContent className="pt-8 px-6 pb-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <User className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-wide">Shift Information</h2>
        </div>
        <div className="space-y-3.5 text-xs">
          <Row label="Cashier" value={shift?.cashier?.fullName} capitalize />
          <Row label="Shift Start" value={formatDate(shift?.shiftStart)} />
          <Row label="Shift End" value={shift?.shiftEnd ? formatDate(shift.shiftEnd) : "Ongoing"} highlightBadge={!shift?.shiftEnd} />
          <Row label="Duration" value={formatDuration(shift?.shiftStart, shift?.shiftEnd)} />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, highlightBadge, capitalize }) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className="text-gray-500 font-medium">{label}</span>
      {highlightBadge ? (
        <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
          {value}
        </span>
      ) : (
        <span className={`font-semibold text-gray-800 ${capitalize ? "capitalize" : ""}`}>
          {value ?? "—"}
        </span>
      )}
    </div>
  );
}