# Ecoyaan Checkout Flow

A polished, production-quality multi-step checkout experience built with **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**.

---

## Live Demo

> Deployed to Vercel: https://cart-checkout-snowy.vercel.app/

---

## Architecture

### Framework & Routing
- **Next.js 14 App Router** — uses React Server Components for the SSR layer.
- The cart page (`app/page.tsx`) is a **Server Component** that fetches data from the internal API route (`/api/cart`) at request time using `cache: 'no-store'`, guaranteeing fresh data on every visit — equivalent to `getServerSideProps` in the Pages Router.
- Client-side pages (Shipping, Payment, Success) are marked `"use client"` since they require interactivity and access to shared context.

### State Management
- **React Context API** (`context/CheckoutContext.tsx`) holds the cart data, shipping address, selected payment method, and order status.
- The cart data flows: **Server → CartClient (hydrates context) → downstream pages consume it**.
- No external state library is needed; the checkout is a linear flow with a small, well-defined shared state.

### Mock API
- `app/api/cart/route.ts` — a Next.js Route Handler that returns the mock cart JSON with a small simulated delay to mimic a real API.
- The Server Component fetches this route during SSR, so the cart is rendered on the server before the HTML reaches the client.

### Styling
- **Tailwind CSS** with a custom theme extending brand colors (`forest`, `earth`, `cream`, `sage`).
- Custom CSS in `globals.css` handles animations (staggered fade-up, success checkmark draw, spinning loader), form input focus states, and responsive hover interactions.
- **Google Fonts** — Cormorant Garamond (display/headings) + Jost (body) for a refined, brand-appropriate aesthetic.

### Form Validation
- Pure React state with a `validate()` function that checks required fields, email regex, 10-digit Indian mobile number format, and 6-digit PIN code.
- Errors are shown only after first submit attempt (`touched` flag) to avoid nagging the user.

---

## Checkout Flow

```
/ (Cart)  →  /shipping  →  /payment  →  /success
```

Each page guards itself: if required context data is missing (e.g., a user navigates directly to `/payment`), they are redirected back to `/`.

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

**Requirements:** Node.js 18+

---

## Project Structure

```
ecoyaan-checkout/
├── app/
│   ├── layout.tsx          # Root layout with CheckoutProvider + nav
│   ├── globals.css         # Custom animations, form styles, theme vars
│   ├── page.tsx            # 🖥️ SERVER COMPONENT — SSR cart fetch
│   ├── CartClient.tsx      # Client cart UI, hydrates context
│   ├── api/cart/route.ts   # Mock API route returning cart JSON
│   ├── shipping/page.tsx   # Shipping address form with validation
│   ├── payment/page.tsx    # Payment selection + order review
│   └── success/page.tsx    # Order confirmation with animation
├── components/
│   ├── StepProgress.tsx    # Animated 3-step checkout progress bar
│   └── OrderSummary.tsx    # Reusable order totals sidebar
├── context/
│   └── CheckoutContext.tsx # Global checkout state via Context API
├── lib/
│   └── mockData.ts         # Shared mock cart data (used by SSR page + API route)
├── types/
│   └── index.ts            # Shared TypeScript interfaces
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## Design Decisions

- **Eco brand identity**: Forest greens, warm creams, and leaf motifs reinforce Ecoyaan's sustainability mission throughout the UI.
- **Mobile-first grid**: Single-column on mobile, two/three-column on desktop using Tailwind's responsive grid utilities.
- **Staggered animations**: Cart items fade up sequentially on load for a polished, app-like feel without any animation library.
- **Simulated payment**: A 2-second processing delay with a spinner accurately reflects what users experience with real payment gateways.
