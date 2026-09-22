import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

export default function RefundsTable({ refunds = [] }) {
  return (
    <Card className="h-full shadow-sm border border-gray-200 bg-white">
      <CardContent className="pt-8 px-6 pb-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <RotateCcw className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-wide">Refunds Processed</h2>
        </div>
        {refunds.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No refunds this shift</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left font-semibold pb-2">Refund ID</th>
                  <th className="text-left font-semibold pb-2">Order ID</th>
                  <th className="text-left font-semibold pb-2">Reason</th>
                  <th className="text-right font-semibold pb-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {refunds.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3 font-semibold text-slate-800">#{r.id}</td>
                    <td className="py-3 text-gray-500">#{r.orderId}</td>
                    <td className="py-3 font-medium text-slate-700">{r.reason}</td>
                    <td className="py-3 text-right font-bold text-rose-600">
                      -₹{r.amount?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}