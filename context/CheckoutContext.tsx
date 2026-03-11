"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { CartData, SavedAddress, ShippingAddress } from "@/types";

interface CheckoutContextType {
  cartData: CartData | null;
  setCartData: (data: CartData) => void;
  savedAddresses: SavedAddress[];
  addAddress: (address: ShippingAddress, label?: "Home" | "Work" | "Other") => string;
  removeAddress: (id: string) => void;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  shippingAddress: SavedAddress | null;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  orderPlaced: boolean;
  setOrderPlaced: (val: boolean) => void;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

const STORAGE_KEY = "ecoyaan_checkout_v1";

interface PersistedState {
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  paymentMethod: string;
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: PersistedState = JSON.parse(raw);
        if (Array.isArray(saved.savedAddresses)) setSavedAddresses(saved.savedAddresses);
        if (saved.selectedAddressId) setSelectedAddressId(saved.selectedAddressId);
        if (saved.paymentMethod) setPaymentMethod(saved.paymentMethod);
      }
    } catch (e) {
      console.warn("Failed to hydrate checkout state:", e);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever state changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      const state: PersistedState = { savedAddresses, selectedAddressId, paymentMethod };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to persist checkout state:", e);
    }
  }, [savedAddresses, selectedAddressId, paymentMethod, hydrated]);

  const addAddress = useCallback(
    (address: ShippingAddress, label: "Home" | "Work" | "Other" = "Home"): string => {
      const id = `addr_${Date.now()}`;
      const newAddr: SavedAddress = { ...address, id, label };
      setSavedAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(id);
      return id;
    },
    []
  );

  const removeAddress = useCallback((id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    setSelectedAddressId((prev) => (prev === id ? null : prev));
  }, []);

  const shippingAddress =
    savedAddresses.find((a) => a.id === selectedAddressId) ?? null;

  return (
    <CheckoutContext.Provider
      value={{
        cartData,
        setCartData,
        savedAddresses,
        addAddress,
        removeAddress,
        selectedAddressId,
        setSelectedAddressId,
        shippingAddress,
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
