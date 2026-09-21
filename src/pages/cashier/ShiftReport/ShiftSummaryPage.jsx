import React, { useEffect, useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";
import ShiftHeader from "./ShiftHeader";
import ShiftInformation from "./ShiftInformation";
import SalesSummaryCard from "./SalesSummaryCard";
import PaymentSummaryCard from "./PaymentSummaryCard";
import TopSellingItems from "./TopSellingItems";
import RecentOrderTable from "./RecentOrderTable";
import RefundsTable from "./RefundsTable";
import { getCurrentShiftProgress, startShift, endShift } from "@/lib/shiftReportApi";
import useMyBranch from "@/lib/useMyBranch";
import NoBranchNotice from "@/components/NoBranchNotice";

export default function ShiftSummaryPage() {
  const { branchId } = useMyBranch();

  const [shift, setShift] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnding, setIsEnding] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);

  const loadShift = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCurrentShiftProgress();
      setShift(data); // null here just means "no active shift" — not an error
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Failed to load shift progress.";
      if (/no active shift/i.test(message)) {
        setShift(null); // "no active shift" is a normal state, not an error
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!branchId) {
      setIsLoading(false);
      return;
    }
    loadShift();
  }, [branchId]);

  const handleStartShift = async () => {
    setIsStarting(true);
    try {
      const data = await startShift();
      setShift(data);
    } catch (err) {
      alert(err?.response?.data?.message || "Could not start shift.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndShift = async () => {
    if (!window.confirm("End your shift and log out?")) return;
    setIsEnding(true);
    try {
      await endShift();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Could not end shift. Please try again.");
    } finally {
      setIsEnding(false);
    }
  };

  // Signed up but not assigned to a branch yet
  if (!branchId) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <NoBranchNotice />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading shift data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={loadShift}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  // No active shift — normal state, not an error
  if (!shift) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-4">
        <p className="text-slate-600 font-medium">You don't have an active shift right now.</p>
        <button
          onClick={handleStartShift}
          disabled={isStarting}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white rounded-lg text-xs font-bold disabled:opacity-50"
        >
          <PlayCircle className="h-4 w-4" />
          {isStarting ? "Starting..." : "Start Shift"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <ShiftHeader
          onPrint={() => window.print()}
          onEndShift={handleEndShift}
          ending={isEnding}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <ShiftInformation shift={shift} />
          <SalesSummaryCard shift={shift} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <PaymentSummaryCard paymentSummaries={shift?.paymentSummaries} />
          <TopSellingItems products={shift?.topSellingProducts} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <RecentOrderTable orders={shift?.recentOrders} />
          <RefundsTable refunds={shift?.refunds} />
        </div>
      </div>
    </div>
  );
}