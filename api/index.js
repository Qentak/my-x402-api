import express from "express";
import { paymentMiddleware, HTTPFacilitatorClient } from "@x402/express";

const PAY_TO = "0xC4CAF1271B8B2C2C91fC1B3e3aE3B0B3D2a8A4b0";
const app = express();

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator",
});

app.use(paymentMiddleware(
  {
    "GET /api/price": {
      accepts: [{
        scheme: "exact",
        price: "$0.01",
        network: "eip155:8453",
        payTo: PAY_TO,
      }],
      description: "Bitcoin price API",
      mimeType: "application/json",
      discoverable: true,
    },
  },
  facilitatorClient
));

app.get("/api/price", async (req, res) => {
  const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
  const data = await r.json();
  res.json({ success: true, bitcoin_usd: data.bitcoin.usd, timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => res.json({ ok: true, try: "/api/price" }));

export default app;
