import { mockCartData } from "@/lib/mockData";
import CartClient from "./CartClient";

export default async function CartPage() {
  const cartData = await Promise.resolve(mockCartData);
  return <CartClient initialCartData={cartData} />;
}