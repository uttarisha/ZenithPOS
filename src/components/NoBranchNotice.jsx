import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import api from "@/lib/api";

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export default function NoBranchNotice() {
  const user = readUser();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  const whoAssigns =
    user?.role === "ROLE_BRANCH_CASHIER" ? "your branch manager" : "your store admin";

  const checkAgain = async () => {
    setChecking(true);
    setMessage("");
    try {
      const { data } = await api.get("/users/profile");
      if (data.branchId) {
        localStorage.setItem("user", JSON.stringify(data));
        window.location.reload();
      } else {
        setMessage("Still not assigned. Once they assign you, click Check again.");
      }
    } catch {
      setMessage("Could not check right now. Try again in a moment.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-10 text-center bg-white rounded-xl border border-gray-200 space-y-3">
      <p className="text-slate-800 font-semibold text-sm">You're not assigned to a branch yet</p>
      <p className="text-gray-400 text-sm">
        Ask {whoAssigns} to assign your account
        {user?.email ? (
          <>
            {" "}using this email: <span className="font-semibold text-slate-700">{user.email}</span>
          </>
        ) : null}
        .
      </p>

      <button
        onClick={checkAgain}
        disabled={checking}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#312e81] hover:bg-[#1e1b4b] text-white text-xs font-semibold rounded-lg disabled:bg-gray-400"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} />
        {checking ? "Checking..." : "Check again"}
      </button>

      {message && <p className="text-xs text-gray-400">{message}</p>}
    </div>
  );
}