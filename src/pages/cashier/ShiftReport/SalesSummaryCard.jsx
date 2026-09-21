import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function SalesSummaryCard({ shift }) {
  return (
    <Card className="h-full shadow-sm border border-gray-200 bg-white">
      <CardContent className="pt-8 px-6 pb-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-wide">Sales Summary</h2>
        </div>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500 font-medium">Total Orders</span>
            <span className="font-semibold text-gray-800">{shift?.totalOrders ?? 0}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500 font-medium">Total Sales</span>
            <span className="font-semibold text-gray-800">₹{(shift?.totalSales ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-red-600 font-semibold">Total Refunds</span>
            <span className="font-semibold text-red-600">
              -₹{(shift?.totalRefunds ?? 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-100 text-sm">
            <span className="font-bold text-gray-900">Net Sales</span>
            <span className="font-bold text-emerald-700">₹{(shift?.netSale ?? 0).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}