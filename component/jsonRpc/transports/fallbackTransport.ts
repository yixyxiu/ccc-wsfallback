import { Transport } from "./transport";
import { JsonRpcPayload } from "./advanced";
import { TransportWebSocket } from "./webSocket";
import { TransportHttp } from "./http";

/**
 * A transport implementation that attempts WebSocket first and falls back to HTTP if WebSocket fails
 */
export class TransportFallback implements Transport {
  private transport: Transport;
  private wsUrl: string;
  private httpUrl: string;
  private timeout: number;
  private useWebSocket: boolean; // Flag to track if we're using WebSocket

  constructor(wsUrl: string, httpUrl: string, timeout = 5000) {
    this.wsUrl = wsUrl;
    this.httpUrl = httpUrl;
    this.timeout = timeout;
    this.useWebSocket = typeof WebSocket !== "undefined"; // Initialize based on WebSocket availability

    this.transport = this.useWebSocket
      ? new TransportWebSocket(wsUrl, timeout)
      : new TransportHttp(httpUrl, timeout);
  }

  async request(payload: JsonRpcPayload): Promise<unknown> {
    if (!this.useWebSocket) {
      return this.transport.request(payload); // Directly use HTTP if WebSocket is not available
    }

    try {
      return await this.transport.request(payload);
    } catch (error) {
      // Fallback to HTTP only ONCE if WebSocket fails
      if (this.useWebSocket) {
        console.warn("WebSocket connection failed, falling back to HTTP.", error); // Log the error
        this.transport = new TransportHttp(this.httpUrl, this.timeout);
        this.useWebSocket = false; // Prevent further WebSocket attempts
        return this.transport.request(payload);
      }
      throw error; // Re-throw if it's not a WebSocket related error after fallback
    }
  }
}

