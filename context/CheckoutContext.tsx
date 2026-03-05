"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartData, ShippingAddress } from "@/types";

interface CheckoutContextType {
  cartData: CartData | null;
  setCartData: (data: CartData) => void;
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  orderPlaced: boolean;
  setOrderPlaced: (val: boolean) => void;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);

  return (
    <CheckoutContext.Provider
      value={{
        cartData,
        setCartData,
        shippingAddress,
        setShippingAddress,
        paymentMethod,
        setPaymentMethod,
        orderPlaced,
        setOrderPlaced,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
