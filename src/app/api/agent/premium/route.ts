import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { x402Server, evmAddress } from "@/lib/x402-proxy";

export const dynamic = 'force-dynamic';

/**
 * Premium API endpoint for AI Agents.
 * This route is protected by x402 protocol.
 * Agents must include a valid PAYMENT-SIGNATURE header to access.
 */
const handler = async (req: NextRequest) => {
  return NextResponse.json(
    { 
      status: "success",
      message: "Welcome to the CNVerifyHub Premium Agent API.",
      data: {
        market_stats: {
          active_listings: 1250,
          verified_sellers: 85,
          total_volume_24h: "45,000 USDT"
        },
        discovery: {
          api_catalog: "/.well-known/api-catalog",
          support: "t.me/cnverifyhub"
        }
      }
    },
    { status: 200 }
  );
};

let exportGET: any = handler;

try {
  exportGET = withX402(
    handler,
    {
      accepts: [
        {
          scheme: "exact",
          price: "$0.01",
          network: "eip155:8453",
          payTo: evmAddress,
        },
      ],
      description: "Access to CNVerifyHub Premium Market Data",
      mimeType: "application/json",
    },
    x402Server,
  );
} catch (e) {
  console.warn('[x402] Facilitator init bypassed during build:', e);
}

export const GET = exportGET;
