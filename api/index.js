import express from "express";
import { paymentMiddleware } from "x402-express";

const app = express();

// GANTI INI DENGAN WALLET LENGKAP KAMU
const PAY_TO = "0xC4CAF127aFD0A7ae22bbfA27A8f4A9634FD0BF0d";

app.use(paymentMiddleware(
  PAY_TO,
  {
    "GET /api/price": {
      price: "$0.01",
      network: "base",
      config: { description: "Bitcoin price API" }
    }
  },
  { url: "https://x402.org/facilitator" }
));

app.get("/api/price", async (req, res) => {
  const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
  const data = await r.json();
  res.json({ success: true, bitcoin_usd: data.bitcoin.usd, timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => res.json({ ok: true, try: "/api/price" }));

export default app;
