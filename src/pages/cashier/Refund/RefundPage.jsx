import React, { useState } from "react";
import OrderTable from "./OrderTable";
import OrderDetailSection from "./OrderDetailSection";
import ReturnItemSection from "./ReturnItemSection";
import ReturnReceiptDialog from "./ReturnReceiptDialog";

export default function RefundPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [returnReason, setReturnReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("Original Payment Method");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    if (order && order.items) {
      setReturnItems(
        order.items.map((item) => ({
          ...item,
          returnQty: 0,
          isReturning: false,
        }))
      );
    }
  };

  const handleQtyChange = (itemId, qty) => {
    setReturnItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              returnQty: Math.min(qty, item.quantity),
              isReturning: qty > 0,
            }
          : item
      )
    );
  };

  const toggleReturn = (itemId) => {
    setReturnItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              isReturning: !item.isReturning,
              returnQty: !item.isReturning ? 1 : 0,
            }
          : item
      )
    );
  };

  const totalRefundAmount = returnItems.reduce(
    (acc, item) => acc + (item.isReturning ? item.price * item.returnQty : 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Return / Refund</h1>

        {!selectedOrder ? (
          <OrderTable onSelectOrder={handleSelectOrder} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderDetailSection
              selectedOrder={selectedOrder}
              handleSelectOrder={handleSelectOrder}
            />
            <ReturnItemSection
              returnItems={returnItems}
              handleQtyChange={handleQtyChange}
              toggleReturn={toggleReturn}
              returnReason={returnReason}
              setReturnReason={setReturnReason}
              refundMethod={refundMethod}
              setRefundMethod={setRefundMethod}
              totalRefundAmount={totalRefundAmount}
              onOpenConfirm={() => setIsConfirmOpen(true)}
            />
          </div>
        )}

        {isConfirmOpen && (
          <ReturnReceiptDialog
            selectedOrder={selectedOrder}
            returnItems={returnItems.filter((i) => i.isReturning && i.returnQty > 0)}
            returnReason={returnReason}
            refundMethod={refundMethod}
            totalRefundAmount={totalRefundAmount}
            onClose={() => setIsConfirmOpen(false)}
            onSuccess={() => {
              setIsConfirmOpen(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
    </div>
  );
}