import express from "express";
import { paymentMiddleware } from "@x402/express";

const app = express();

const PAY_TO = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
const facilitator = { url: "https://x402.org/facilitator" };

app.use(
  paymentMiddleware(
    PAY_TO,
    {
      "/api/price": {
        price: "$0.01",
        network: "base-sepolia",
        config: { description: "Bitcoin price" },
      },
    },
    facilitator
  )
);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/api/price", async (req, res) => {
  const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
  const data = await r.json();
  res.json({ bitcoin_usd: data.bitcoin.usd });
});

export default app;
