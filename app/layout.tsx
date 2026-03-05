import type { Metadata } from "next";
import "./globals.css";
import { CheckoutProvider } from "@/context/CheckoutContext";

export const metadata: Metadata = {
  title: "Ecoyaan — Sustainable Checkout",
  description: "Complete your eco-friendly purchase securely.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CheckoutProvider>
          {/* Top nav bar */}
          <header className="bg-white border-b border-forest-100 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                <span
                  className="text-forest-700 font-bold tracking-wide"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}
                >
                  Ecoyaan
                </span>
              </div>
              <span className="text-xs text-forest-500 font-body tracking-widest uppercase">
                Secure Checkout
              </span>
            </div>
          </header>

          <main className="min-h-screen bg-cream">{children}</main>

          <footer className="py-6 text-center text-xs text-forest-400 border-t border-forest-100 mt-8">
            <p>🌱 Every purchase plants a tree &nbsp;·&nbsp; Carbon neutral shipping &nbsp;·&nbsp; 100% eco-packaging</p>
          </footer>
        </CheckoutProvider>
      </body>
    </html>
  );
}
