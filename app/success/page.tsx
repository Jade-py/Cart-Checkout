"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const { orderPlaced, shippingAddress, cartData } = useCheckout();
  const orderRef = useRef(`ECO-${Math.floor(100000 + Math.random() * 900000)}`);

  // Guard: if order not placed, go back
  useEffect(() => {
    if (!orderPlaced) router.replace("/");
  }, [orderPlaced, router]);

  if (!orderPlaced) return null;

  const total =
    cartData
      ? cartData.cartItems.reduce((a, i) => a + i.product_price * i.quantity, 0) +
        cartData.shipping_fee -
        cartData.discount_applied
      : 0;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Animated checkmark */}
      <div className="success-circle mb-8">
        <div className="relative w-28 h-28">
          {/* Glowing ring */}
          <div className="absolute inset-0 rounded-full bg-forest-100 animate-ping opacity-30" />
          <div className="relative w-28 h-28 bg-gradient-to-br from-forest-500 to-forest-700 rounded-full flex items-center justify-center shadow-xl shadow-forest-300/40">
            <svg
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
            >
              <path
                className="check-path"
                d="M14 27l10 10 16-20"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60"
                strokeDashoffset="60"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1
        className="text-4xl sm:text-5xl text-forest-900 text-center mb-2 stagger-item"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, animationDelay: "0.3s" }}
      >
        Order Confirmed! 🌿
      </h1>
      <p className="text-forest-500 text-center mb-8 stagger-item" style={{ animationDelay: "0.4s" }}>
        Thank you for shopping sustainably.
      </p>

      {/* Details card */}
      <div
        className="bg-white rounded-2xl border border-forest-100 shadow-sm p-6 w-full max-w-md stagger-item"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-forest-50">
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-widest">Order ID</p>
            <p className="font-mono text-forest-700 font-semibold text-lg">{orderRef.current}</p>
          </div>
          <span className="bg-forest-100 text-forest-700 text-xs font-semibold px-3 py-1 rounded-full">
            Confirmed
          </span>
        </div>

        {shippingAddress && (
          <div className="mb-4 pb-4 border-b border-forest-50">
            <p className="text-xs text-forest-400 uppercase tracking-widest mb-2">Delivering To</p>
            <p className="text-sm font-semibold text-forest-900">{shippingAddress.fullName}</p>
            <p className="text-sm text-forest-600">{shippingAddress.email}</p>
            <p className="text-sm text-forest-600">
              {shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pinCode}
            </p>
          </div>
        )}

        {cartData && (
          <div className="mb-4 pb-4 border-b border-forest-50 space-y-2">
            {cartData.cartItems.map((item) => (
              <div key={item.product_id} className="flex justify-between text-sm text-forest-700">
                <span className="truncate pr-2">{item.product_name} × {item.quantity}</span>
                <span className="font-medium whitespace-nowrap">₹{(item.product_price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between text-base font-bold text-forest-900">
          <span>Total Paid</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Eco impact */}
      <div
        className="mt-6 bg-forest-50 border border-forest-200 rounded-2xl px-6 py-4 w-full max-w-md stagger-item text-center"
        style={{ animationDelay: "0.6s" }}
      >
        <p className="text-forest-700 text-sm font-medium mb-1">🌱 Your Environmental Impact</p>
        <p className="text-xs text-forest-500">
          This order will offset <strong>~1.2 kg CO₂</strong> and fund planting <strong>1 tree</strong> through our reforestation partners.
        </p>
      </div>

      {/* CTA */}
      <div
        className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-md stagger-item"
        style={{ animationDelay: "0.7s" }}
      >
        <Link
          href="/"
          className="btn-primary flex-1 py-3.5 rounded-xl text-sm text-center font-medium tracking-wide uppercase"
        >
          Continue Shopping
        </Link>
        <button
          onClick={() => window.print()}
          className="flex-1 py-3.5 rounded-xl border-2 border-forest-200 text-forest-600 text-sm font-medium hover:bg-forest-50 transition-colors"
        >
          🖨️ Print Receipt
        </button>
      </div>
    </div>
  );
}
