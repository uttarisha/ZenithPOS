import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Banknote, Smartphone, Wallet } from "lucide-react";

const iconMap = {
  CARD: CreditCard,
  CASH: Banknote,
  UPI: Smartphone,
};

export default function PaymentSummaryCard({ paymentSummaries = [] }) {
  return (
    <Card className="h-full shadow-sm border border-gray-200 bg-white">
      <CardContent className="pt-8 px-6 pb-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Wallet className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-wide">Payment Summary</h2>
        </div>
        {paymentSummaries.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No transactions recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {paymentSummaries.map((p) => {
              const Icon = iconMap[p.type] || CreditCard;
              return (
                <div key={p.type} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{p.type}</p>
                      <p className="text-[11px] text-gray-500">
                        {p.transactionCount} transaction{p.transactionCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">₹{p.totalAmount?.toFixed(2)}</p>
                    <p className="text-[11px] font-semibold text-indigo-600">{p.percentage?.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}