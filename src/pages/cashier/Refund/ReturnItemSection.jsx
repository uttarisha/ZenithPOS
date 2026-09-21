import React from "react";

export default function ReturnItemSection({
  returnItems,
  handleQtyChange,
  toggleReturn,
  returnReason,
  setReturnReason,
  refundMethod,
  setRefundMethod,
  totalRefundAmount,
  onOpenConfirm,
}) {
  return (
    <div className="space-y-4 text-xs">
      <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Return Items</h3>

        {/* Return Items Selection Table */}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-normal">
              <th className="pb-2">Item</th>
              <th className="pb-2 text-center">Ordered</th>
              <th className="pb-2 text-center">Return Qty</th>
              <th className="pb-2 text-right">Refund Amount</th>
              <th className="pb-2 text-right">Return?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {returnItems.map((item) => (
              <tr key={item.id}>
                <td className="py-3 font-medium text-slate-800 max-w-[140px] truncate">
                  {item.name}
                </td>
                <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                <td className="py-3 text-center">
                  <input
                    type="number"
                    min="0"
                    max={item.quantity}
                    value={item.returnQty}
                    onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value) || 0)}
                    disabled={!item.isReturning}
                    className="w-12 text-center border border-gray-200 rounded py-0.5 disabled:bg-gray-50"
                  />
                </td>
                <td className="py-3 text-right font-semibold">
                  {item.isReturning ? `₹${(item.price * item.returnQty).toFixed(2)}` : "-"}
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => toggleReturn(item.id)}
                    className={`px-3 py-1 rounded text-xs border font-medium transition-colors ${
                      item.isReturning
                        ? "bg-[#312e81] text-white border-[#312e81]"
                        : "bg-white text-slate-700 border-gray-300 hover:bg-slate-50"
                    }`}
                  >
                    {item.isReturning ? "Yes" : "No"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Return Reason and Process Panel */}
      <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm space-y-4">
        <div>
          <label className="block font-semibold text-slate-800 mb-1">Return Reason</label>
          <select
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value="">Select a reason...</option>
            <option value="Damaged product">Damaged product</option>
            <option value="Wrong item delivered">Wrong item delivered</option>
            <option value="Customer change of mind">Customer change of mind</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-800 mb-1">Refund Method</label>
          <select
            value={refundMethod}
            onChange={(e) => setRefundMethod(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value="Original Payment Method">Original Payment Method ()</option>
            <option value="Cash">Cash</option>
            <option value="Store Credit">Store Credit</option>
          </select>
        </div>

        <div className="flex justify-between items-center pt-2 font-bold text-slate-900 text-sm">
          <span>Total Refund Amount:</span>
          <span>₹{totalRefundAmount.toFixed(2)}</span>
        </div>

        <button
          disabled={totalRefundAmount === 0 || !returnReason}
          onClick={onOpenConfirm}
          className="w-full py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors"
        >
          Process Refund
        </button>
      </div>
    </div>
  );
}