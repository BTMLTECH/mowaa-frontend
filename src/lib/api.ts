// src/lib/api.ts
// const API_BASE = import.meta.env.VITE_API_BASE;
const API_BASE = "http://localhost:5000/api";

export const api = {
  initiatePayment: async (payload: FormData) => {
    const res = await fetch(`${API_BASE}/initiate-payment`, {
      method: "POST",
      body: payload,
    });
    return res.json();
  },

  verifyPayment: async (reference: string) => {
    const res = await fetch(
      `${API_BASE}/verify-payment?reference=${reference}`
    );
    return res.json();
  },

  getExchangeRate: async () => {
    const res = await fetch(`${API_BASE}/exchange-rate`);
    return res.json();
  },
};
