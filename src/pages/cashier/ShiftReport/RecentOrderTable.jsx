import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt } from "lucide-react";

export default function RecentOrderTable({ orders = [] }) {
  return (
    <Card className="h-full shadow-sm border border-gray-200 bg-white">
      <CardContent className="pt-8 px-6 pb-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
            <Receipt className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-wide">Recent Orders</h2>
        </div>
        {orders.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No recent orders</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left font-semibold pb-2">Order ID</th>
                  <th className="text-left font-semibold pb-2">Time</th>
                  <th className="text-left font-semibold pb-2">Payment</th>
                  <th className="text-right font-semibold pb-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 font-semibold text-slate-800">#{o.id}</td>
                    <td className="py-3 text-gray-500">
                      {new Date(o.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 font-medium text-slate-700">{o.paymentType}</td>
                    <td className="py-3 text-right font-bold text-slate-900">
                      ₹{o.totalAmount?.toFixed(2)}
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