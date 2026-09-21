import React from "react";
import { Calendar, IndianRupee } from "lucide-react";

export default function PurchaseHistory({ history }) {
  const totalSpentHistory = history.reduce((acc, item) => acc + item.totalAmount, 0);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-600">Total Purchase Value</h3>
        <p className="text-2xl font-black text-[#312e81] mt-2 flex items-center">
          <IndianRupee className="w-5 h-5 mr-0.5" />
          {totalSpentHistory.toFixed(2)}
        </p>
      </div>

      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-600">Purchase History</h3>
        {history.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No previous purchases found.</p>
        ) : (
          history.map((order) => (
            <div key={order.id} className="border border-slate-100 rounded-xl p-4 bg-indigo-50/20 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{order.orderNumber}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{order.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 flex items-center justify-end">
                    <IndianRupee className="w-3 h-3" />
                    {order.totalAmount.toFixed(2)}
                  </span>
                  <span className="inline-block px-2 py-0.5 text-[10px] bg-[#312e81] text-white font-medium rounded-md mt-1">
                    {order.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500">Payment : {order.paymentMethod}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <p className="text-[11px] font-semibold text-slate-600">Items:</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-700">
                    <span>{item.name}</span>
                    <span className="font-mono text-slate-500 flex items-center">
                      {item.quantity} × <IndianRupee className="w-3 h-3 ml-1 mr-0.5" />{item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}