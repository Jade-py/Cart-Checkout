"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import StepProgress from "@/components/StepProgress";
import BottomBar from "@/components/BottomBar";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
  { id: "upi",  label: "UPI",                 icon: "📱", desc: "GPay, PhonePe, Paytm" },
  { id: "netbanking", label: "Net Banking",   icon: "🏦", desc: "All major banks" },
  { id: "cod",  label: "Cash on Delivery",    icon: "💵", desc: "Pay when delivered" },
];

function formatCard(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val: string) {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

export default function PaymentPage() {
  const router = useRouter();
  const { cartData, shippingAddress, paymentMethod, setPaymentMethod, setOrderPlaced } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (!cartData || !shippingAddress) router.replace("/");
  }, [cartData, shippingAddress, router]);

  if (!cartData || !shippingAddress) return null;

  const subtotal = cartData.cartItems.reduce((a, i) => a + i.product_price * i.quantity, 0);
  const total = subtotal + cartData.shipping_fee - cartData.discount_applied;

  async function handlePay() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setOrderPlaced(true);
    router.push("/success");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-28">
      <StepProgress current={2} />

      <div className="mb-6 stagger-item" style={{ animationDelay: "0.05s" }}>
        <h1
          className="text-3xl sm:text-4xl text-forest-900"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          Payment
        </h1>
        <p className="text-forest-500 text-sm mt-1">Review your order and complete payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 stagger-item" style={{ animationDelay: "0.12s" }}>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-sm">
            <h2 className="font-semibold text-forest-800 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
              <span>💳</span> Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex flex-col items-start gap-0.5 p-3 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === m.id
                      ? "border-forest-500 bg-forest-50"
                      : "border-forest-100 hover:border-forest-200 hover:bg-forest-50/50"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className={`text-xs font-semibold ${paymentMethod === m.id ? "text-forest-800" : "text-forest-600"}`}>
                    {m.label}
                  </span>
                  <span className="text-xs text-forest-400">{m.desc}</span>
                </button>
              ))}
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-3 pt-4 border-t border-forest-50">
                <div>
                  <label className="text-xs font-medium text-forest-600 uppercase tracking-wide">Card Number</label>
                  <input
                    type="text" value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className="form-input w-full mt-1 px-4 py-3 text-sm text-forest-900 placeholder-forest-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-forest-600 uppercase tracking-wide">Expiry</label>
                    <input type="text" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="form-input w-full mt-1 px-4 py-3 text-sm text-forest-900 placeholder-forest-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-forest-600 uppercase tracking-wide">CVV</label>
                    <input type="password" value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="•••"
                      className="form-input w-full mt-1 px-4 py-3 text-sm text-forest-900 placeholder-forest-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="pt-4 border-t border-forest-50">
                <label className="text-xs font-medium text-forest-600 uppercase tracking-wide">UPI ID</label>
                <input type="text" placeholder="yourname@upi"
                  className="form-input w-full mt-1 px-4 py-3 text-sm text-forest-900 placeholder-forest-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Pay summary sidebar */}
        <div className="space-y-4 stagger-item" style={{ animationDelay: "0.2s" }}>
          <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-sm">
            <h3
              className="text-forest-800 mb-4 text-lg"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Order Summary
            </h3>

            {/* Delivering To */}
            <div className="pb-4 mb-4 border-b border-forest-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-forest-500 uppercase tracking-widest flex items-center gap-1">
                  <span>📍</span> Delivering To
                </p>
                <button
                  onClick={() => router.push("/shipping")}
                  className="text-xs text-forest-500 underline hover:text-forest-700 transition-colors"
                >
                  Change
                </button>
              </div>
              <div className="bg-forest-50 rounded-xl p-3 space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-forest-900">{shippingAddress.fullName}</p>
                  <span className="text-xs bg-forest-200 text-forest-700 px-2 py-0.5 rounded-full font-medium">
                    {shippingAddress.label}
                  </span>
                </div>
                <p className="text-xs text-forest-500">{shippingAddress.email} · {shippingAddress.phone}</p>
                <p className="text-xs text-forest-500">{shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pinCode}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4 space-y-3 pb-4 border-b border-forest-50">
              {cartData.cartItems.map((item) => (
                <div key={item.product_id} className="flex gap-3 items-start">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-12 h-12 rounded-lg object-cover border border-forest-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-forest-800 font-medium leading-snug line-clamp-2">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-forest-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-forest-700 whitespace-nowrap">
                    ₹{(item.product_price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm pb-4 border-b border-forest-50">
              <div className="flex justify-between text-forest-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-forest-600">
                <span>Shipping</span>
                <span className="text-earth-600">₹{cartData.shipping_fee}</span>
              </div>
              <div className="pt-3 border-t border-forest-100 flex justify-between font-semibold text-base text-forest-900">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-forest-400 flex items-center gap-1">
              <span>🔒</span> Payments are 100% secure & encrypted
            </p>
          </div>

          <div className="bg-forest-50 rounded-xl border border-forest-200 p-4 text-xs text-forest-600 flex items-start gap-2">
            <span>🌿</span>
            <span>Your order is carbon-offset. We partner with certified tree-planting programs across India.</span>
          </div>

        </div>
      </div>

      <BottomBar
        onBack={() => router.push("/shipping")}
        backLabel="Back"
        nextLabel={`Pay Securely · ₹${total.toLocaleString()}`}
        onNext={handlePay}
        loading={loading}
      />
    </div>
  );
}
