"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import StepProgress from "@/components/StepProgress";
import OrderSummary from "@/components/OrderSummary";
import { ShippingAddress } from "@/types";

type FormErrors = Partial<Record<keyof ShippingAddress, string>>;

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

function validate(data: ShippingAddress): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[6-9]\d{9}$/.test(data.phone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number";
  }
  if (!data.pinCode.trim()) {
    errors.pinCode = "PIN code is required";
  } else if (!/^\d{6}$/.test(data.pinCode)) {
    errors.pinCode = "PIN code must be 6 digits";
  }
  if (!data.city.trim()) errors.city = "City is required";
  if (!data.state) errors.state = "Please select a state";
  return errors;
}

interface FieldProps {
  label: string;
  name: keyof ShippingAddress;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  maxLength?: number;
}

function FormField({ label, name, type = "text", placeholder, value, error, onChange, maxLength }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-forest-600 tracking-wide uppercase">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`form-input px-4 py-3 text-sm text-forest-900 placeholder-forest-300 ${
          error ? "error" : ""
        }`}
      />
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}

export default function ShippingPage() {
  const router = useRouter();
  const { cartData, shippingAddress, setShippingAddress } = useCheckout();
  const [touched, setTouched] = useState(false);

  const [form, setForm] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    pinCode: "",
    city: "",
    state: "",
    ...shippingAddress,
  });

  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;

  // Guard: if no cart data, go back to cart
  useEffect(() => {
    if (!cartData) router.replace("/");
  }, [cartData, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    setTouched(true);
    if (hasErrors) return;
    setShippingAddress(form);
    router.push("/payment");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <StepProgress current={1} />

      <div className="mb-6">
        <h1
          className="text-3xl sm:text-4xl text-forest-900"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          Shipping Address
        </h1>
        <p className="text-forest-500 text-sm mt-1">Where should we deliver your order?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FormField
                  label="Full Name"
                  name="fullName"
                  placeholder="Priya Sharma"
                  value={form.fullName}
                  error={touched ? errors.fullName : undefined}
                  onChange={handleChange}
                />
              </div>
              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="priya@example.com"
                value={form.email}
                error={touched ? errors.email : undefined}
                onChange={handleChange}
              />
              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                error={touched ? errors.phone : undefined}
                onChange={handleChange}
                maxLength={10}
              />
              <FormField
                label="PIN Code"
                name="pinCode"
                placeholder="400001"
                value={form.pinCode}
                error={touched ? errors.pinCode : undefined}
                onChange={handleChange}
                maxLength={6}
              />
              <FormField
                label="City"
                name="city"
                placeholder="Mumbai"
                value={form.city}
                error={touched ? errors.city : undefined}
                onChange={handleChange}
              />

              {/* State dropdown */}
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-forest-600 tracking-wide uppercase">
                  State
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={`form-input px-4 py-3 text-sm text-forest-900 appearance-none bg-white ${
                    touched && errors.state ? "error" : ""
                  }`}
                >
                  <option value="">Select your state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {touched && errors.state && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                    <span>⚠️</span> {errors.state}
                  </p>
                )}
              </div>
            </div>

            {touched && hasErrors && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                <span>⚠️</span> Please fix the errors above to continue.
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.back()}
              className="flex-1 py-3.5 rounded-xl border-2 border-forest-200 text-forest-600 text-sm font-medium hover:bg-forest-50 transition-colors"
            >
              ← Back to Cart
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex-2 flex-grow py-3.5 rounded-xl text-sm uppercase tracking-wide"
            >
              Continue to Payment →
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {cartData && <OrderSummary cartData={cartData} showItems />}
        </div>
      </div>
    </div>
  );
}
