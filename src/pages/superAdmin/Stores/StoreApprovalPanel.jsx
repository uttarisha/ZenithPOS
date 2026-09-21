import React from "react";

const STATUSES = ["ACTIVE", "PENDING", "BLOCKED"];

const STATUS_STYLES = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  BLOCKED: "bg-red-50 text-red-700 border-red-200",
};

export default function StoreApprovalPanel({ status, onChange, saving }) {
  return (
    <div className="flex items-center gap-2">
      {STATUSES.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          disabled={saving || s === status}
          className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-colors disabled:cursor-not-allowed ${
            s === status
              ? STATUS_STYLES[s]
              : "bg-white text-gray-400 border-gray-200 hover:border-[#312e81] hover:text-[#312e81]"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}