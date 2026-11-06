import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

const app = express();
const PAY_TO = "0xC4CAF127afD0A7ae22bbfA27A8f4A9634FD0B0BF0d";

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator",
});

const server = new x402ResourceServer(facilitatorClient)
  .register("eip155:*", new ExactEvmScheme());

app.use(paymentMiddleware(
  {
    "GET /api/price": {
      accepts: [{
        scheme: "exact",
        price: "$0.01",
        network: "eip155:84532",
        payTo: PAY_TO,
      }],
      description: "Bitcoin price API",
      mimeType: "application/json",
      discoverable: true,
    },
  },
  server
));

app.get("/api/price", async (req, res) => {
  const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
  const data = await r.json();
  res.json({ success: true, bitcoin_usd: data.bitcoin.usd, timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => res.json({ ok: true, try: "/api/price" }));

export default app;
