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
      const wsResponse = await this.transport.request(payload);
      // 检查响应是否包含错误
      if (wsResponse && typeof wsResponse === 'object' && 'error' in wsResponse) {
        throw new Error(`RPC Error: ${wsResponse.error}`);
      }
      return wsResponse;
    } catch (error) {
      if (this.useWebSocket) {
        console.warn("WebSocket request failed, falling back to HTTP");
        this.transport = new TransportHttp(this.httpUrl, this.timeout);
        this.useWebSocket = false;
        // 尝试HTTP请求
        const httpResponse = await this.transport.request(payload);
        // 同样检查HTTP响应中的错误
        if (httpResponse && typeof httpResponse === 'object' && 'error' in httpResponse) {
          throw new Error(`HTTP RPC Error: ${httpResponse.error}`);
        }
        return httpResponse;
      }
      throw error;
    }
  }
}

