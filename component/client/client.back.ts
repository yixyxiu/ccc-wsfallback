import { RequestorJsonRpc } from "../jsonRpc";
import { ClientJsonRpcConfig } from "./jsonRpc";

/**
 * An abstract class implementing JSON-RPC client functionality for a specific URL and timeout.
 * Provides methods for sending transactions and building JSON-RPC payloads.
 */
export abstract class ClientJsonRpc {
  public readonly requestor: RequestorJsonRpc;

  /**
   * Creates an instance of ClientJsonRpc.
   *
   * @param url_ - The URL of the JSON-RPC server.
   * @param timeout - The timeout for requests in milliseconds
   */

  constructor(url_: string, config?: ClientJsonRpcConfig) {

    this.requestor =
      config?.requestor ??
      new RequestorJsonRpc(url_, config, (errAny) => {
        
      });
  }
}