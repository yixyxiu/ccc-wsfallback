import { TransportHttp } from "./http";
import { TransportWebSocket } from "./webSocket";
import { TransportFallback } from "./fallbackTransport";

export function transportFromUri(uri: string, config?: { timeout?: number }) {
  // For CKB mainnet and testnet URLs, use fallback transport
  if (uri === "wss://mainnet.ckb.dev/ws") {
    return new TransportFallback(
      "wss://mainnet.ckb.dev/ws",
      "https://mainnet.ckb.dev/",
      config?.timeout
    );
  }
  if (uri === "wss://testnet.ckb.dev/ws") {
    return new TransportFallback(
      "wss://testnet.ckb.dev/ws",
      "https://testnet.ckb.dev/",
      config?.timeout
    );
  }

  // For other URLs, use original logic
  if (uri.startsWith("wss://") || uri.startsWith("ws://")) {
    return new TransportWebSocket(uri, config?.timeout);
  }

  return new TransportHttp(uri, config?.timeout);
}
