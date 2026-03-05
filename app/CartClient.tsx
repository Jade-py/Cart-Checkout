"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CartData, CartItem } from "@/types";
import { useCheckout } from "@/context/CheckoutContext";
import StepProgress from "@/components/StepProgress";
import OrderSummary from "@/components/OrderSummary";

interface Props {
  initialCartData: CartData;
}

function CartItemCard({ item, index }: { item: CartItem; index: number }) {
  return (
    <div
      className="cart-card stagger-item flex gap-4 p-4 sm:p-5"
      style={{ animationDelay: `${0.08 * index}s` }}
    >
      {/* Product image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-forest-50 border border-forest-100">
        <img
          src={item.image}
          alt={item.product_name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-forest-900 font-medium text-sm sm:text-base leading-snug">
          {item.product_name}
        </h3>
        <p className="text-xs text-forest-400 mt-1 flex items-center gap-1">
          <span>🌿</span> Sustainably sourced
        </p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity badge */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-forest-500 font-medium">Qty:</span>
            <span className="bg-forest-50 text-forest-700 border border-forest-200 text-sm font-semibold px-3 py-1 rounded-lg">
              {item.quantity}
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-forest-700 font-semibold text-base">
              ₹{(item.product_price * item.quantity).toLocaleString()}
            </p>
            <p className="text-xs text-forest-400">
              ₹{item.product_price} each
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartClient({ initialCartData }: Props) {
  const router = useRouter();
  const { setCartData } = useCheckout();

  // Hydrate context with SSR-fetched data
  useEffect(() => {
    setCartData(initialCartData);
  }, [initialCartData, setCartData]);

  const subtotal = initialCartData.cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <StepProgress current={0} />

      {/* Page heading */}
      <div className="mb-6 stagger-item" style={{ animationDelay: "0s" }}>
        <h1
          className="text-3xl sm:text-4xl text-forest-900"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          Your Cart
        </h1>
        <p className="text-forest-500 text-sm mt-1">
          {initialCartData.cartItems.length} item{initialCartData.cartItems.length !== 1 ? "s" : ""} — ready to checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items column */}
        <div className="lg:col-span-2 space-y-3">
          {initialCartData.cartItems.map((item, i) => (
            <CartItemCard key={item.product_id} item={item} index={i} />
          ))}

          {/* Eco badge */}
          <div
            className="stagger-item mt-2 flex items-center gap-3 bg-forest-50 border border-forest-200 rounded-xl px-4 py-3"
            style={{ animationDelay: "0.25s" }}
          >
            <span className="text-2xl">🌱</span>
            <p className="text-xs text-forest-600 leading-relaxed">
              <strong className="font-semibold">You're making a difference.</strong>{" "}
              This order offsets approximately 1.2 kg of CO₂ and funds tree-planting initiatives.
            </p>
          </div>
        </div>

        {/* Order summary column */}
        <div
          className="stagger-item"
          style={{ animationDelay: "0.18s" }}
        >
          <OrderSummary cartData={initialCartData} />

          <button
            onClick={() => router.push("/shipping")}
            className="btn-primary w-full mt-4 py-4 rounded-xl text-sm font-medium tracking-wide flex items-center justify-center gap-2 uppercase"
          >
            Proceed to Checkout
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <p className="text-center text-xs text-forest-400 mt-3 flex items-center justify-center gap-1">
            <span>🔒</span> 256-bit SSL Encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
