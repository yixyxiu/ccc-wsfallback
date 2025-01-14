import WebSocket from "isomorphic-ws";
import { ClientJsonRpc, ClientJsonRpcConfig } from "./jsonRpc";

/**
 * @public
 */
export class ClientPublicTestnet extends ClientJsonRpc {
  constructor(
    private readonly config?: ClientJsonRpcConfig & {
      url?: string;
    },
  ) {
    super(
      config?.url ??
        (typeof WebSocket !== "undefined"
          ? "wss://testnet.ckb.dev/ws"
          : "https://testnet.ckb.dev/"),
      config,
    );
  }

}
