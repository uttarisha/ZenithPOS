import React, { useEffect, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { getRefundsByBranchApi } from "@/lib/branchRefundApi";
import useMyBranch from "@/lib/useMyBranch";
import NoBranchNotice from "@/components/NoBranchNotice";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function BranchRefunds() {
  const { branchId } = useMyBranch();

  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!branchId) {
      setLoading(false);
      return;
    }
    fetchRefunds();
  }, [branchId]);

  const fetchRefunds = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRefundsByBranchApi(branchId);
      setRefunds(data);
    } catch (err) {
      setRefunds([]);
      setError(getErrorMessage(err, "Could not load refunds"));
    } finally {
      setLoading(false);
    }
  };

  const totalRefunded = refunds.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Refunds</h1>
          <p className="text-sm text-gray-400">{refunds.length} refunds logged at this branch</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-red-600">₹{totalRefunded.toFixed(2)}</p>
          <p className="text-xs text-gray-400">Total Refunded</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
          {error}
        </div>
      )}

      {!branchId ? (
        <NoBranchNotice />
      ) : loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
        </div>
      ) : refunds.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400 text-sm">
          No refunds recorded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {refunds.map((refund) => (
            <div
              key={refund.id}
              className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <RotateCcw className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Order #{refund.orderId}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{refund.reason}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {refund.cashierName} · {new Date(refund.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="font-bold text-red-600 text-sm">-₹{refund.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}