import WebSocket from "isomorphic-ws";
import { ClientJsonRpc, ClientJsonRpcConfig } from "./jsonRpc";

/**
 * @public
 */
export class ClientPublicMainnet extends ClientJsonRpc {
  constructor(
    private readonly config?: ClientJsonRpcConfig & {
      url?: string;
    },
  ) {
    super(
      config?.url ??
        (typeof WebSocket !== "undefined"
          ? "wss://mainnet.ckb.dev/ws"
          : "https://mainnet.ckb.dev/"),
      config,
    );
  }
}
