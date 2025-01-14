import { RequestorJsonRpc, RequestorJsonRpcConfig } from "@/component/jsonRpc";



export type ClientJsonRpcConfig = RequestorJsonRpcConfig & {
  requestor?: RequestorJsonRpc;
};

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
      new RequestorJsonRpc(url_, config);
  }

  /**
   * Returns the URL of the JSON-RPC server.
   *
   * @returns The URL of the JSON-RPC server.
   */
  get url(): string {
    return this.requestor.url;
  }

  /**
   * Builds a sender function for a JSON-RPC method.
   *
   * @param rpcMethod - The JSON-RPC method.
   * @param inTransformers - An array of input transformers.
   * @param outTransformer - An output transformer function.
   * @returns A function that sends a JSON-RPC request with the given method and transformed parameters.
   */

  buildSender(
    rpcMethod: Parameters<RequestorJsonRpc["request"]>[0],
    inTransformers?: Parameters<RequestorJsonRpc["request"]>[2],
    outTransformer?: Parameters<RequestorJsonRpc["request"]>[3],
  ): (...req: unknown[]) => Promise<unknown> {
    return async (...req: unknown[]) => {
      return this.requestor.request(
        rpcMethod,
        req,
        inTransformers,
        outTransformer,
      );
    };
  }
}
