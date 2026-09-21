import React from "react";

export default function OrderItemTable({ items = [] }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 mb-6">
      <h4 className="font-bold text-slate-900 text-xs mb-3">Order Items</h4>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-gray-400 font-medium border-b border-gray-200/60 pb-2">
            <th className="pb-2 font-normal">Image</th>
            <th className="pb-2 font-normal">Item</th>
            <th className="pb-2 text-center font-normal">Quantity</th>
            <th className="pb-2 text-right font-normal">Price</th>
            <th className="pb-2 text-right font-normal">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/40">
          {items.map((item) => {
            const product = item.product || {};
            const total = (item.price ?? 0) * (item.quantity ?? 0);

            return (
              <tr key={item.id}>
                <td className="py-2.5">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name || "Product"}
                      className="h-10 w-10 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-100" />
                  )}
                </td>
                <td className="py-2.5 pr-2 max-w-[180px]">
                  <p className="font-bold text-slate-800 truncate">{product.name || "—"}</p>
                  <p className="text-[10px] text-gray-400 truncate">SKU: {product.sku || "—"}</p>
                </td>
                <td className="py-2.5 text-center font-semibold text-slate-700">{item.quantity}</td>
                <td className="py-2.5 text-right text-gray-600">₹{(item.price ?? 0).toFixed(2)}</td>
                <td className="py-2.5 text-right font-bold text-slate-900">₹{total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}