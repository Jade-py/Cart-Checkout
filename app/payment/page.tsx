"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import StepProgress from "@/components/StepProgress";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
];

export default function PaymentPage() {
  const router = useRouter();
  const { cartData, shippingAddress, paymentMethod, setPaymentMethod, setOrderPlaced } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Guard: redirect if missing state
  useEffect(() => {
    if (!cartData || !shippingAddress) router.replace("/");
  }, [cartData, shippingAddress, router]);

  if (!cartData || !shippingAddress) return null;

  const subtotal = cartData.cartItems.reduce(
    (a, item) => a + item.product_price * item.quantity,
    0
  );
  const total = subtotal + cartData.shipping_fee - cartData.discount_applied;

  function formatCardNumber(val: string) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  async function handlePay() {
    setLoading(true);
    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 2000));
    setOrderPlaced(true);
    router.push("/success");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <StepProgress current={2} />

      <div className="mb-6">
        <h1
          className="text-3xl sm:text-4xl text-forest-900"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          Payment
        </h1>
        <p className="text-forest-500 text-sm mt-1">Review your order and complete payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Order review */}
          <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-sm">
            <h2 className="font-semibold text-forest-800 mb-4 flex items-center gap-2">
              <span>📦</span> Order Review
            </h2>
            <div className="space-y-3">
              {cartData.cartItems.map((item) => (
                <div key={item.product_id} className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-12 h-12 rounded-lg object-cover border border-forest-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-forest-900 truncate">{item.product_name}</p>
                    <p className="text-xs text-forest-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-forest-800 text-sm">
                    ₹{(item.product_price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery address review */}
          <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-forest-800 flex items-center gap-2">
                <span>📍</span> Delivering To
              </h2>
              <button
                onClick={() => router.push("/shipping")}
                className="text-xs text-forest-500 underline hover:text-forest-700"
              >
                Edit
              </button>
            </div>
            <div className="bg-forest-50 rounded-xl p-4 text-sm text-forest-700 space-y-1">
              <p className="font-semibold text-forest-900">{shippingAddress.fullName}</p>
              <p>{shippingAddress.email} · {shippingAddress.phone}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pinCode}</p>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-sm">
            <h2 className="font-semibold text-forest-800 mb-4 flex items-center gap-2">
              <span>💳</span> Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`payment-card flex items-center gap-2 p-3 text-sm font-medium transition-all ${
                    paymentMethod === m.id ? "selected text-forest-800" : "text-forest-500 hover:bg-forest-50"
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="text-xs sm:text-sm">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Card form (shown only when card is selected) */}
            {paymentMethod === "card" && (
              <div className="space-y-3 pt-3 border-t border-forest-50">
                <div>
                  <label className="text-xs font-medium text-forest-600 uppercase tracking-wide">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className="form-input w-full mt-1 px-4 py-3 text-sm text-forest-900 placeholder-forest-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-forest-600 uppercase tracking-wide">Expiry</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="form-input w-full mt-1 px-4 py-3 text-sm text-forest-900 placeholder-forest-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-forest-600 uppercase tracking-wide">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="•••"
                      className="form-input w-full mt-1 px-4 py-3 text-sm text-forest-900 placeholder-forest-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="pt-3 border-t border-forest-50">
                <label className="text-xs font-medium text-forest-600 uppercase tracking-wide">UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="form-input w-full mt-1 px-4 py-3 text-sm text-forest-900 placeholder-forest-300"
                />
              </div>
            )}
          </div>

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="text-sm text-forest-500 hover:text-forest-700 flex items-center gap-1 transition-colors"
          >
            ← Back to Shipping
          </button>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-sm">
            <h3
              className="text-forest-800 mb-4 text-lg"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Amount Payable
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-forest-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-forest-600">
                <span>Shipping</span>
                <span>₹{cartData.shipping_fee}</span>
              </div>
              <div className="border-t border-forest-100 pt-3 mt-1 flex justify-between font-bold text-lg text-forest-900">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className={`btn-primary w-full mt-5 py-4 rounded-xl text-sm font-medium tracking-widest uppercase flex items-center justify-center gap-2 ${
                loading ? "opacity-75 cursor-wait" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  🔒 Pay Securely · ₹{total.toLocaleString()}
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-3 text-forest-300">
              <span className="text-xs">Visa</span>
              <span>·</span>
              <span className="text-xs">Mastercard</span>
              <span>·</span>
              <span className="text-xs">UPI</span>
              <span>·</span>
              <span className="text-xs">RuPay</span>
            </div>
          </div>

          <div className="bg-forest-50 rounded-xl border border-forest-200 p-4 text-xs text-forest-600">
            <p className="flex items-start gap-2">
              <span>🌿</span>
              <span>Your order is carbon-offset. We partner with certified tree-planting programs across India.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
