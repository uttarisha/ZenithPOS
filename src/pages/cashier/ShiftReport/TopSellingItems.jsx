import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function TopSellingItems({ products = [] }) {
  return (
    <Card className="h-full shadow-sm border border-gray-200 bg-white">
      <CardContent className="pt-8 px-6 pb-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-wide">Top Selling Items</h2>
        </div>
        {products.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No sales recorded yet</p>
        ) : (
          <div className="space-y-3">
            {products.map((p, i) => (
              <div key={p.id || i} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-6 w-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                </div>
                <span className="text-xs font-bold text-slate-900 shrink-0">
                  ₹{p.sellingPrice?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}