import { CartData } from "@/types";

interface Props {
  cartData: CartData;
  showItems?: boolean;
}

export default function OrderSummary({ cartData, showItems = false }: Props) {
  const subtotal = cartData.cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );
  const total = subtotal + cartData.shipping_fee - cartData.discount_applied;

  return (
    <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-sm">
      <h3
        className="text-forest-800 mb-4 text-lg"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
      >
        Order Summary
      </h3>

      {showItems && (
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
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-forest-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-forest-600">
          <span>Shipping</span>
          <span className="text-earth-600">₹{cartData.shipping_fee}</span>
        </div>
        {cartData.discount_applied > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>−₹{cartData.discount_applied}</span>
          </div>
        )}
        <div className="border-t border-forest-100 pt-3 mt-1 flex justify-between font-semibold text-base text-forest-900">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-forest-400 flex items-center gap-1">
        <span>🔒</span> Payments are 100% secure & encrypted
      </p>
    </div>
  );
}
