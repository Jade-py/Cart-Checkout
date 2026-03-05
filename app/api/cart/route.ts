import { NextResponse } from "next/server";
import { CartData } from "@/types";

const mockCartData: CartData = {
  cartItems: [
    {
      product_id: 101,
      product_name: "Bamboo Toothbrush (Pack of 4)",
      product_price: 299,
      quantity: 2,
      image: "https://via.placeholder.com/150/2e6330/ffffff?text=🪥",
    },
    {
      product_id: 102,
      product_name: "Reusable Cotton Produce Bags",
      product_price: 450,
      quantity: 1,
      image: "https://via.placeholder.com/150/3d7d3d/ffffff?text=🛍",
    },
  ],
  shipping_fee: 50,
  discount_applied: 0,
};

export async function GET() {
  // Simulate network latency for realism
  await new Promise((resolve) => setTimeout(resolve, 80));
  return NextResponse.json(mockCartData);
}
