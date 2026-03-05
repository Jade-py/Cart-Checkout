import { CartData } from "@/types";
import CartClient from "./CartClient";

// SSR: fetch cart data server-side on every request
async function getCartData(): Promise<CartData> {
  // In production this would be an external API.
  // Here we fetch our own Next.js API route during SSR.
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/cart`, {
    // No-store ensures fresh data on every request (SSR, not cached)
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch cart data");
  return res.json();
}

export default async function CartPage() {
  const cartData = await getCartData();

  return <CartClient initialCartData={cartData} />;
}
