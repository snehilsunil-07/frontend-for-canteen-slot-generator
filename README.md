# Gather — Smart Canteen

A React and Tailwind CSS prototype for Sahyadri College of Engineering & Management in Mangaluru, Karnataka. Browse a coastal Karnataka-inspired canteen menu, build an order, select a pickup slot, and receive a pickup token.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run `npm run build`.

## Prototype notes

- Menu items are inspired by regional favourites such as neer dosa, kori rotti, Mangalore buns, and goli baje. Menu items, prices, pickup availability, and the student profile are sample data in `src/App.jsx`; they are not confirmed as the college canteen's actual offerings.
- UPI selection and payment are simulated. No payment is processed and no real order is sent to a canteen.
- A production deployment needs a backend for menu/slot inventory, order persistence, token validation, and a payment-provider integration.
