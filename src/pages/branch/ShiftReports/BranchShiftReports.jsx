import React, { useEffect, useState } from "react";
import { Loader2, Clock } from "lucide-react";
import { getShiftReportsByBranchApi } from "@/lib/branchShiftReportApi";
import useMyBranch from "@/lib/useMyBranch";
import NoBranchNotice from "@/components/NoBranchNotice";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function BranchShiftReports() {
  const { branchId } = useMyBranch();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!branchId) {
      setLoading(false);
      return;
    }
    fetchReports();
  }, [branchId]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getShiftReportsByBranchApi(branchId);
      setReports(data);
    } catch (err) {
      setReports([]);
      setError(getErrorMessage(err, "Could not load shift reports"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Shift Reports</h1>
        <p className="text-sm text-gray-400">Cashier shift summaries for this branch</p>
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
      ) : reports.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400 text-sm">
          No shift reports yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">{report.cashier?.fullName}</h3>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(report.shiftStart).toLocaleTimeString()} –{" "}
                  {report.shiftEnd ? new Date(report.shiftEnd).toLocaleTimeString() : "Ongoing"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-400">Total Sales</p>
                  <p className="font-bold text-slate-800">₹{report.totalSales?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Refunds</p>
                  <p className="font-bold text-red-600">₹{report.totalRefunds?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Net Sale</p>
                  <p className="font-bold text-[#312e81]">₹{report.netSale?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Orders</p>
                  <p className="font-bold text-slate-800">{report.totalOrders}</p>
                </div>
              </div>

              <p className="text-[11px] text-gray-400">
                {new Date(report.shiftStart).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}