import { paymentProxy } from "@x402/next";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

// Receiving wallet address (ERC20/BEP20)
export const evmAddress = process.env.NEXT_PUBLIC_ERC20_WALLET || "0xb47669d0d17b57be5af515bf57e0294c130359b1";

// Create facilitator client (Mainnet - Coinbase CDP)
const facilitatorClient = new HTTPFacilitatorClient({ 
  url: "https://api.cdp.coinbase.com/platform/v2/x402" 
});

// Create and register the resource server
export const x402Server = new x402ResourceServer(facilitatorClient);
x402Server.register("eip155:*", new ExactEvmScheme());

// Export proxy for middleware or API wrapping
export const proxy = paymentProxy(
  {
    "/api/agent/premium": {
      accepts: [
        {
          scheme: "exact",
          price: "$0.01",
          network: "eip155:8453", // Base mainnet
          payTo: evmAddress,
        }
      ],
      description: "Premium AI Agent API Access - CNVerifyHub",
      mimeType: "application/json",
    },
  },
  x402Server,
);
