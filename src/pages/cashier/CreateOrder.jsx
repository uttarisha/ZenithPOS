import React, { useState, useEffect } from "react";
import {
  Search,
  Scan,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  User,
  Percent,
  FileText,
  CreditCard,
  Banknote,
  Smartphone,
  Package,
} from "lucide-react";

import { getProductsApi, submitOrderApi } from "@/lib/createOrderApi";
import useMyBranch from "@/lib/useMyBranch"; // NEW
import NoBranchNotice from "@/components/NoBranchNotice"; // NEW
import CustomerPicker from "./CustomerPicker";

const TAX_RATE = 0.1; // keep in sync with TAX_RATE in OrderServiceImpl

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "UPI", label: "UPI", icon: Smartphone },
  { value: "CARD", label: "Card", icon: CreditCard },
];

const round2 = (n) => Math.round(n * 100) / 100;

function ProductImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-indigo-50/60">
        <Package className="h-8 w-8 text-indigo-200" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
    />
  );
}

export default function CreateOrder() {
  const { branchId } = useMyBranch(); // NEW

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState(null);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("CASH");
  const [discountType, setDiscountType] = useState("percent");
  const [discountVal, setDiscountVal] = useState(0);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!branchId) return; // NEW: nothing to load for an unassigned cashier
    getProductsApi(search)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, [search, branchId]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const updated = item.quantity + delta;
            return updated > 0 ? { ...item, quantity: updated } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setCart([]);

  // Preview only: the backend recalculates these with the same formula.
  const subtotal = round2(cart.reduce((acc, item) => acc + item.price * item.quantity, 0));
  const tax = round2(subtotal * TAX_RATE);

  const discountInput = Math.max(0, Number(discountVal) || 0);
  const effectiveDiscountValue =
    discountType === "percent" ? Math.min(discountInput, 100) : discountInput;

  const rawDiscount =
    discountType === "percent"
      ? (subtotal * effectiveDiscountValue) / 100
      : effectiveDiscountValue;

  const discountAmount = round2(Math.min(rawDiscount, subtotal + tax));
  const total = round2(Math.max(0, subtotal + tax - discountAmount));

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return alert("Cart is empty!");
    }

    setLoading(true);

    try {
      const res = await submitOrderApi({
        items: cart,
        customer,
        paymentType,
        discountType,
        discountValue: effectiveDiscountValue,
        note,
      });

      alert(
        `Order #${res.orderId} created successfully!\nTotal paid: ₹${Number(
          res.totalAmount ?? total
        ).toFixed(2)} (${paymentType})`
      );

      // start fresh for the next customer
      clearCart();
      setCustomer(null);
      setNote("");
      setDiscountVal(0);
      setPaymentType("CASH");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to submit order.");
    } finally {
      setLoading(false);
    }
  };

  // NEW: a cashier who signed up but isn't assigned to a branch yet
  if (!branchId) {
    return (
      <div className="flex-1 min-h-0 bg-gray-50/50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <NoBranchNotice />
        </div>
      </div>
    );
  }

  return (
    // Fills exactly the space under the header, so nothing is pushed off-screen.
    <div className="flex-1 min-h-0 bg-gray-50/50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-4">
        {/* Page Heading */}
        <div className="flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Order</h1>
        </div>

        {/* Main Grid: one fixed-height row on large screens */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 lg:grid-rows-1 lg:overflow-hidden">
          {/* Left: Products Catalog */}
          <section className="col-span-12 lg:col-span-5 min-h-0 max-h-[70vh] lg:max-h-none flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex gap-2 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#312e81]"
                />
              </div>

              <button className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-indigo-50 text-slate-700 font-medium text-xs rounded-lg transition-colors">
                <Scan className="h-4 w-4" />
                Scan
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-500 shrink-0">
              {products.length} Products Available
            </p>

            <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-2 gap-3 pr-1 content-start">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group border border-gray-100 hover:border-[#312e81] rounded-xl p-3 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="w-full h-28 rounded-lg overflow-hidden bg-gray-50 mb-2">
                    <ProductImage src={product.image} alt={product.name} />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{product.sku}</p>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                    <span className="text-xs font-bold text-[#312e81]">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] bg-indigo-50 text-[#312e81] font-semibold px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Center: Cart */}
          <section className="col-span-12 lg:col-span-4 min-h-0 max-h-[70vh] lg:max-h-none flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#312e81]" />
                <h2 className="font-bold text-sm text-slate-800">Cart ({totalItemsCount} items)</h2>
              </div>

              <button
                onClick={clearCart}
                className="px-2.5 py-1 text-xs font-semibold border border-red-200 text-red-600 rounded-md hover:bg-red-50 flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                  <ShoppingCart className="h-10 w-10 stroke-1 mb-2 text-gray-300" />
                  Your cart is empty
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border border-indigo-100 bg-indigo-50/20 rounded-xl space-y-2 relative"
                  >
                    <div className="flex justify-between items-start pr-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-mono">{item.sku}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute right-2 top-2 text-gray-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-indigo-50 text-slate-600 rounded-l-lg"
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="px-3 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-indigo-50 text-slate-600 rounded-r-lg"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block">
                          ₹{item.price.toFixed(2)} each
                        </span>
                        <span className="text-xs font-bold text-[#312e81]">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-gray-100 text-xs space-y-1.5 shrink-0">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Tax ({TAX_RATE * 100}%)</span>
                <span className="font-semibold text-slate-700">₹{tax.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-indigo-700 font-medium">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-gray-200">
                <span>Total Pay</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Right: scrollable options + pinned checkout */}
          <section className="col-span-12 lg:col-span-3 min-h-0 flex flex-col gap-4">
            {/* Scrollable area: Customer, Discount, Note */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 pb-1">
              {/* Customer */}
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                    <User className="h-4 w-4 text-[#312e81]" />
                    Customer
                  </div>
                  {customer && (
                    <button
                      onClick={() => setCustomer(null)}
                      className="text-[11px] font-semibold text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsCustomerOpen(true)}
                  className="w-full py-2 px-3 border border-gray-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-indigo-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {customer
                    ? `${customer.name}${customer.phone ? ` (${customer.phone})` : ""}`
                    : "Select Customer"}
                </button>
              </div>

              {/* Discount */}
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <Percent className="h-4 w-4 text-[#312e81]" />
                  Discount
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={discountType === "percent" ? 100 : undefined}
                    value={discountVal}
                    onChange={(e) => setDiscountVal(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-[#312e81]"
                    placeholder="0"
                  />

                  <div className="flex border border-gray-200 rounded-lg overflow-hidden shrink-0">
                    <button
                      onClick={() => setDiscountType("percent")}
                      className={`px-3 text-xs font-bold transition-colors ${
                        discountType === "percent"
                          ? "bg-[#312e81] text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      %
                    </button>

                    <button
                      onClick={() => setDiscountType("flat")}
                      className={`px-3 text-xs font-bold transition-colors ${
                        discountType === "flat"
                          ? "bg-[#312e81] text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      ₹
                    </button>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <FileText className="h-4 w-4 text-[#312e81]" />
                  Note
                </div>

                <textarea
                  rows={2}
                  maxLength={500}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter note..."
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-[#312e81] resize-none"
                />
              </div>
            </div>

            {/* Checkout: always visible */}
            <div className="shrink-0 p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
              {/* Payment method */}
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPaymentType(value)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[11px] font-semibold transition-colors ${
                      paymentType === value
                        ? "bg-[#312e81] text-white border-[#312e81]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#312e81]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-black text-[#312e81]">₹{total.toFixed(2)}</h2>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                  Total Amount Due
                </p>
              </div>

              {/* Dark Twilight Blue Payment Button */}
              <button
                disabled={loading}
                onClick={handleCheckout}
                className="w-full py-3 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                <CreditCard className="h-4 w-4" />
                {loading ? "Processing..." : "Process Payment"}
              </button>
            </div>
          </section>
        </div>
      </div>

      <CustomerPicker
        isOpen={isCustomerOpen}
        onClose={() => setIsCustomerOpen(false)}
        onSelect={setCustomer}
        selectedId={customer?.id}
      />
    </div>
  );
}