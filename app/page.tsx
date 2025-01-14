"use client";

import { ClientPublicMainnet } from "@/component/client/clientPublicMainnet";
import { ClientPublicTestnet } from "@/component/client/clientPublicTestnet";
import React from "react";

export default function Home() {
  const [logs, setLogs] = React.useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prevLogs => [...prevLogs, message]);
  };

  function hexToBigInt(hex: string): bigint {
    // 移除可能存在的 "0x" 前缀
    const cleanHex = hex.replace(/^0x/, '')
    // 添加 "0x" 前缀并转换
    return BigInt("0x" + cleanHex)
  }

  interface TipHeader {
    compact_target: string;
    dao: string;
    epoch: string;
    extra_hash: string;
    hash: string;
    nonce: string;
    number: string;
    parent_hash: string;
    proposals_hash: string;
    timestamp: string;
    transactions_root: string;
    version: string;
  }

  const getClientUrl = (client: ClientPublicMainnet | ClientPublicTestnet) => {
    const jsonString = JSON.stringify(client.requestor.transport);
    //console.log(jsonString);
    const json = JSON.parse(jsonString);
    return json.transport.url;
  };

  const onConnectTestNet = async () => {
    addLog("connect testnet");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const testnetClient = new ClientPublicTestnet();
    const url = getClientUrl(testnetClient);
    addLog(`rpc url: ${url}`);
    const getTipHeader = testnetClient.buildSender("get_tip_header");
    try {
      const tipHeader = await getTipHeader() as TipHeader;
      const tipBlock = hexToBigInt(tipHeader.number).toString();
      addLog(`Current tip block: ${tipBlock}`);
      const newUrl = getClientUrl(testnetClient);
      addLog(`rpc url: ${newUrl}`);
    } catch (error) {
      const errorMessage = 'Error getting tip header: ' + error;
      addLog(errorMessage);
      addLog(`rpc url: ${getClientUrl(testnetClient)}`);
    }
  };

  const onConnectMainNet = async () => {
    addLog("connect mainnet");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const mainnetClient = new ClientPublicMainnet();
    const url = getClientUrl(mainnetClient);
    addLog(`rpc url: ${url}`);
    const getTipHeader = mainnetClient.buildSender("get_tip_header");
    try {
      const tipHeader = await getTipHeader() as TipHeader;
      const tipBlock = hexToBigInt(tipHeader.number).toString();
      addLog(`Current tip block: ${tipBlock}`);
      const newUrl = getClientUrl(mainnetClient);
      addLog(`rpc url: ${newUrl}`);
    } catch (error) {
      const errorMessage = 'Error getting tip header: ' + error;
      addLog(errorMessage);
      addLog(`rpc url: ${getClientUrl(mainnetClient)}`);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-wrap gap-4">
          <a
            className="flex gap-4 items-center flex-col sm:flex-row rounded-full px-4 py-2 underline underline-offset-2 text-slate-800"
            href="https://testnet.ckb.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            测试线路1(ckb.dev)
          </a>
          <a
            className="flex gap-4 items-center flex-col sm:flex-row rounded-full px-4 py-2 underline underline-offset-2 text-slate-800"
            href="https://testnet.ckbapp.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            测试线路2(ckbapp.dev)
          </a>
          <a
            className="flex gap-4 items-center flex-col sm:flex-row rounded-full px-4 py-2 underline underline-offset-2 text-slate-800"
            href="https://mainnet.ckb.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            主网线路1(ckb.dev)
          </a>
          <a
            className="flex gap-4 items-center flex-col sm:flex-row rounded-full px-4 py-2 underline underline-offset-2 text-slate-800"
            href="https://mainnet.ckbapp.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            主网线路2(ckbapp.dev)
          </a>
        </div>

        <div className="flex gap-4 items-center ">
          <div
            className="flex gap-4 items-center flex-col sm:flex-row rounded-full px-4 py-2 bg-slate-800 text-white"
            onClick={onConnectTestNet}
          >
            Connect TestNet
          </div>
          <div
            className="flex gap-4 items-center flex-col sm:flex-row rounded-full px-4 py-2 bg-slate-800 text-white"
            onClick={onConnectMainNet}
          >
            Connect MainNet
          </div>
        </div>

        <div className="w-full max-w-2xl bg-gray-100 rounded-lg p-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">Logs</h2>
          <div className="bg-white rounded border p-2 h-[400px] overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="py-1 border-b last:border-b-0">
                {log}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
