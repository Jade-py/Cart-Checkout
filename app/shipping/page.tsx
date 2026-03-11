"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import StepProgress from "@/components/StepProgress";
import OrderSummary from "@/components/OrderSummary";
import BottomBar from "@/components/BottomBar";
import { ShippingAddress, SavedAddress } from "@/types";

type FormErrors = Partial<Record<keyof ShippingAddress, string>>;
type AddressLabel = "Home" | "Work" | "Other";

const LABEL_ICONS: Record<AddressLabel, string> = { Home: "🏠", Work: "💼", Other: "📍" };

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
  "Chandigarh","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const EMPTY_FORM: ShippingAddress = {
  fullName: "", email: "", phone: "", pinCode: "", city: "", state: "",
};

function validate(data: ShippingAddress): FormErrors {
  const e: FormErrors = {};
  if (!data.fullName.trim()) e.fullName = "Full name is required";
  if (!data.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email";
  if (!data.phone.trim()) e.phone = "Phone is required";
  else if (!/^[6-9]\d{9}$/.test(data.phone)) e.phone = "Enter a valid 10-digit mobile number";
  if (!data.pinCode.trim()) e.pinCode = "PIN code is required";
  else if (!/^\d{6}$/.test(data.pinCode)) e.pinCode = "PIN code must be 6 digits";
  if (!data.city.trim()) e.city = "City is required";
  if (!data.state) e.state = "Please select a state";
  return e;
}

function AddressCard({
  address,
  selected,
  onSelect,
  onDelete,
}: {
  address: SavedAddress;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
        selected
          ? "border-forest-500 bg-forest-50 shadow-md"
          : "border-forest-100 bg-white hover:border-forest-300 hover:shadow-sm"
      }`}
    >
      {/* Label badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
          selected ? "bg-forest-600 text-white" : "bg-forest-100 text-forest-700"
        }`}>
          <span>{LABEL_ICONS[address.label]}</span> {address.label}
        </span>
        <div className="flex items-center gap-2">
          {selected && (
            <span className="w-5 h-5 rounded-full bg-forest-600 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-forest-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            title="Remove address"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <p className="text-sm font-semibold text-forest-900">{address.fullName}</p>
      <p className="text-xs text-forest-500 mt-0.5">{address.email} · {address.phone}</p>
      <p className="text-xs text-forest-500">{address.city}, {address.state} – {address.pinCode}</p>
    </div>
  );
}

export default function ShippingPage() {
  const router = useRouter();
  const { cartData, savedAddresses, addAddress, removeAddress, selectedAddressId, setSelectedAddressId } = useCheckout();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ShippingAddress>(EMPTY_FORM);
  const [label, setLabel] = useState<AddressLabel>("Home");
  const [touched, setTouched] = useState(false);
  const [proceedError, setProceedError] = useState("");

  const errors = validate(form);

  useEffect(() => {
    if (!cartData) router.replace("/");
  }, [cartData, router]);

  // Auto-show form if no saved addresses
  useEffect(() => {
    if (savedAddresses.length === 0) setShowForm(true);
  }, [savedAddresses.length]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSaveAddress() {
    setTouched(true);
    if (Object.keys(errors).length > 0) return;
    addAddress(form, label);
    setForm(EMPTY_FORM);
    setLabel("Home");
    setTouched(false);
    setShowForm(false);
  }

  function handleProceed() {
    if (!selectedAddressId) {
      setProceedError("Please select or add a delivery address to continue.");
      return;
    }
    setProceedError("");
    router.push("/payment");
  }

  const labels: AddressLabel[] = ["Home", "Work", "Other"];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-28">
      <StepProgress current={1} />

      <div className="mb-6 stagger-item" style={{ animationDelay: "0.05s" }}>
        <h1
          className="text-3xl sm:text-4xl text-forest-900"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          Shipping Address
        </h1>
        <p className="text-forest-500 text-sm mt-1">Where should we deliver your order?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 stagger-item" style={{ animationDelay: "0.12s" }}>

          {/* Saved address cards */}
          {savedAddresses.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-forest-500 uppercase tracking-widest">Saved Addresses</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr, i) => (
                  <div key={addr.id} className="stagger-item" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                    <AddressCard
                      address={addr}
                      selected={addr.id === selectedAddressId}
                      onSelect={() => { setSelectedAddressId(addr.id); setProceedError(""); }}
                      onDelete={() => removeAddress(addr.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new address toggle */}
          {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="stagger-item w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-forest-200 text-forest-600 text-sm font-medium hover:border-forest-400 hover:bg-forest-50 transition-all"
            style={{ animationDelay: `${0.1 + savedAddresses.length * 0.08}s` }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add New Address
          </button>
          ) : (
            <div className="stagger-item bg-white rounded-2xl border border-forest-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-forest-800">
                  {savedAddresses.length > 0 ? "New Address" : "Delivery Address"}
                </p>
                {savedAddresses.length > 0 && (
                  <button
                    onClick={() => { setShowForm(false); setTouched(false); setForm(EMPTY_FORM); }}
                    className="text-xs text-forest-400 hover:text-forest-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Label selector */}
              <div className="flex gap-2 mb-4">
                {labels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLabel(l)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                      label === l
                        ? "border-forest-500 bg-forest-600 text-white"
                        : "border-forest-100 text-forest-500 hover:border-forest-300"
                    }`}
                  >
                    <span>{LABEL_ICONS[l]}</span> {l}
                  </button>
                ))}
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name - full width */}
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-forest-600 tracking-wide uppercase">Full Name</label>
                  <input
                    name="fullName" type="text" value={form.fullName} onChange={handleChange}
                    placeholder="Priya Sharma"
                    className={`form-input px-4 py-3 text-sm text-forest-900 placeholder-forest-300 ${touched && errors.fullName ? "error" : ""}`}
                  />
                  {touched && errors.fullName && <p className="text-xs text-red-500">⚠️ {errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-forest-600 tracking-wide uppercase">Email</label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="priya@example.com"
                    className={`form-input px-4 py-3 text-sm text-forest-900 placeholder-forest-300 ${touched && errors.email ? "error" : ""}`}
                  />
                  {touched && errors.email && <p className="text-xs text-red-500">⚠️ {errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-forest-600 tracking-wide uppercase">Phone</label>
                  <input
                    name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="9876543210" maxLength={10}
                    className={`form-input px-4 py-3 text-sm text-forest-900 placeholder-forest-300 ${touched && errors.phone ? "error" : ""}`}
                  />
                  {touched && errors.phone && <p className="text-xs text-red-500">⚠️ {errors.phone}</p>}
                </div>

                {/* PIN Code */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-forest-600 tracking-wide uppercase">PIN Code</label>
                  <input
                    name="pinCode" type="text" value={form.pinCode} onChange={handleChange}
                    placeholder="400001" maxLength={6}
                    className={`form-input px-4 py-3 text-sm text-forest-900 placeholder-forest-300 ${touched && errors.pinCode ? "error" : ""}`}
                  />
                  {touched && errors.pinCode && <p className="text-xs text-red-500">⚠️ {errors.pinCode}</p>}
                </div>

                {/* City */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-forest-600 tracking-wide uppercase">City</label>
                  <input
                    name="city" type="text" value={form.city} onChange={handleChange}
                    placeholder="Mumbai"
                    className={`form-input px-4 py-3 text-sm text-forest-900 placeholder-forest-300 ${touched && errors.city ? "error" : ""}`}
                  />
                  {touched && errors.city && <p className="text-xs text-red-500">⚠️ {errors.city}</p>}
                </div>

                {/* State */}
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-forest-600 tracking-wide uppercase">State</label>
                  <select
                    name="state" value={form.state} onChange={handleChange}
                    className={`form-input px-4 py-3 text-sm text-forest-900 bg-white appearance-none ${touched && errors.state ? "error" : ""}`}
                  >
                    <option value="">Select your state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {touched && errors.state && <p className="text-xs text-red-500">⚠️ {errors.state}</p>}
                </div>
              </div>

              <button
                onClick={handleSaveAddress}
                className="mt-4 w-full py-3 rounded-xl bg-forest-600 text-white text-sm font-medium hover:bg-forest-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Save Address
              </button>
            </div>
          )}

          {/* Proceed error */}
          {proceedError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              <span>⚠️</span> {proceedError}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="stagger-item" style={{ animationDelay: "0.2s" }}>{cartData && <OrderSummary cartData={cartData} showItems />}</div>
      </div>

      <BottomBar
        onBack={() => router.push("/")}
        backLabel="Back to Cart"
        nextLabel="Continue to Payment"
        onNext={handleProceed}
      />
    </div>
  );
}
