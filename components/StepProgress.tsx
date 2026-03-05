"use client";

const steps = [
  { label: "Cart", icon: "🛒" },
  { label: "Shipping", icon: "📦" },
  { label: "Payment", icon: "💳" },
];

export default function StepProgress({ current }: { current: 0 | 1 | 2 }) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            {/* Step node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm
                  transition-all duration-300
                  ${i < current
                    ? "bg-forest-600 text-white shadow-md"
                    : i === current
                    ? "bg-forest-700 text-white ring-4 ring-forest-200 shadow-lg scale-110"
                    : "bg-white border-2 border-forest-200 text-forest-300"
                  }
                `}
              >
                {i < current ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7l4 4 6-7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>
              <span
                className={`text-xs font-medium tracking-wide transition-colors duration-200 ${
                  i <= current ? "text-forest-700" : "text-forest-300"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-all duration-500 ${
                  i < current ? "bg-forest-500" : "bg-forest-100"
                }`}
                style={{ minWidth: 40 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
