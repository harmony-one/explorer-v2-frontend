import { IGetTxsHistoryParams, RequestOrder, RequestTxType, RPCTransactionHarmony } from "../types";

export type TRPCResponse<T> = { id: number; jsonrpc: "2.0"; result: T, error?: { code: number, message: string } };

const API_URL = 'https://a.api.s0.t.hmny.io/'

export const rpcAdapter = <T = any>(...args: Parameters<typeof fetch>) => {
  /**
   * wrapper for fetch. for some middleware in future requests
   */

  return fetch
    .apply(window, args)
    .then((res) => res.json()) as unknown as Promise<T>;
};

export const getBalance = (params: [string, "latest"]) => {
  return rpcAdapter<TRPCResponse<string>>(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getBalance",
      id: 1,
      params,
    }),
  });
};


export const hmyv2_getTransactionReceipt = (
  params: [string],
  shardNumber: number
) => {
  return rpcAdapter<TRPCResponse<{ logs: [{ data: string }], gasUsed: string }>>(
    process.env[`REACT_APP_RPC_URL_SHARD${shardNumber}`] as string,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "hmyv2_getTransactionReceipt",
        id: 1,
        params,
      }),
    }
  ); 
};

export const getAllBalance = (params: [string, "latest"]) => {
  return Promise.all([
    rpcAdapter<TRPCResponse<string>>(
      `${process.env["REACT_APP_RPC_URL_SHARD0"]}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          id: 1,
          params,
        }),
      }
    ),
    rpcAdapter<TRPCResponse<string>>(
      `${process.env["REACT_APP_RPC_URL_SHARD1"]}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          id: 1,
          params,
        }),
      }
    ),
    rpcAdapter<TRPCResponse<string>>(
      `${process.env["REACT_APP_RPC_URL_SHARD2"]}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          id: 1,
          params,
        }),
      }
    ),
    rpcAdapter<TRPCResponse<string>>(
      `${process.env["REACT_APP_RPC_URL_SHARD3"]}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          id: 1,
          params,
        }),
      }
    ),
  ]).then((arr) => {
    return Promise.resolve(arr.map((item) => item.result));
  });
};

const defaultGetHistoryParams = {
  fullTx: true,
  txType: RequestTxType.ALL,
  order: RequestOrder.DESC
}

export const hmyv2_getTransactionsHistory = (params: IGetTxsHistoryParams[]) => {
  return rpcAdapter<TRPCResponse<{ transactions: RPCTransactionHarmony[] }>>(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "hmyv2_getTransactionsHistory",
      id: 1,
      params: [{...defaultGetHistoryParams, ...params[0]}],
    }),
  }).then(data => {
    if (data.error) {
      throw new Error(data.error.message)
    }
    return data.result.transactions
  });
};

export const hmyv2_getTransactionsCount = (address: string, txType: RequestTxType = RequestTxType.ALL) => {
  return rpcAdapter<TRPCResponse<number>>(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "hmyv2_getTransactionsCount",
      id: 1,
      params: [address, txType],
    }),
  }).then(data => {
    if (data.error) {
      throw new Error(data.error.message)
    }
    return data.result
  });
};

export const hmyv2_getStakingTransactionsHistory = (params: IGetTxsHistoryParams[]) => {
  return rpcAdapter<TRPCResponse<{ staking_transactions: RPCTransactionHarmony[] }>>(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "hmyv2_getStakingTransactionsHistory",
      id: 1,
      params: [{...defaultGetHistoryParams, ...params[0]}],
    }),
  }).then(data => {
    if (data.error) {
      throw new Error(data.error.message)
    }
    return data.result.staking_transactions
  });
};

export const hmyv2_getStakingTransactionsCount = (address: string, txType: RequestTxType = RequestTxType.ALL) => {
  return rpcAdapter<TRPCResponse<number>>(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "hmyv2_getStakingTransactionsCount",
      id: 1,
      params: [address, txType],
    }),
  }).then(data => {
    if (data.error) {
      throw new Error(data.error.message)
    }
    return data.result
  });
};
