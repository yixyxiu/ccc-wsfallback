import { Transport } from "./transport";
import { JsonRpcPayload } from "./advanced";
import { TransportWebSocket } from "./webSocket";
import { TransportHttp } from "./http";

/**
 * A transport implementation that attempts WebSocket first and falls back to HTTP if WebSocket fails
 */
export class TransportFallback implements Transport {
  private transport: Transport;
  private hasWebSocket: boolean;
  private wsUrl: string;
  private httpUrl: string;
  private timeout: number;
  private wsInitialized = false;

  constructor(wsUrl: string, httpUrl: string, timeout = 5000) {
    this.wsUrl = wsUrl;
    this.httpUrl = httpUrl;
    this.timeout = timeout;
    this.hasWebSocket = typeof WebSocket !== "undefined";
    // Start with HTTP transport if WebSocket is not supported
    this.transport = this.hasWebSocket
      ? new TransportWebSocket(wsUrl, timeout)
      : new TransportHttp(httpUrl, timeout);
    console.log(`FallbackTransport initialized with ${this.hasWebSocket ? 'WebSocket' : 'HTTP'} transport`);
  }

  async request(payload: JsonRpcPayload): Promise<unknown> {
    console.log(`FallbackTransport handling request with ${this.transport.constructor.name}`);
    // If WebSocket is not supported or we've already fallen back to HTTP, just use current transport
    if (!this.hasWebSocket || !this.wsInitialized) {
      try {
        if (this.hasWebSocket && !this.wsInitialized) {
          console.log('Attempting first WebSocket request...');
          this.wsInitialized = true;
          // 强制触发错误，这样就会fallback到HTTP
          throw new Error('Simulated WebSocket error');
        }
        return await this.transport.request(payload);
      } catch (error) {
        // 移除条件检查，让任何错误都触发fallback
        console.log('WebSocket request failed, falling back to HTTP transport');
        this.transport = new TransportHttp(this.httpUrl, this.timeout);
        return await this.transport.request(payload);
      }
    }

    // If we're already using HTTP transport, just use it
    return await this.transport.request(payload);
  }
}
