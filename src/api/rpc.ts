export type TRPCResponse<T> = { id: number; jsonrpc: "2.0"; result: T };

export const rpcAdapter = <T = any>(...args: Parameters<typeof fetch>) => {
  /**
   * wrapper for fetch. for some middleware in future requests
   */

  return (fetch
    .apply(window, args)
    .then((res) => res.json()) as unknown) as Promise<T>;
};

export const getBalance = (params: [string, "latest"]) => {
  return rpcAdapter<TRPCResponse<string>>("https://api.s0.t.hmny.io/", {
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

export const getTransactionReceipt = (shard: number, params: [string]) => {
  return rpcAdapter<TRPCResponse<any>>(`https://api.s${shard}.t.hmny.io/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "hmy_getTransactionReceipt",
      id: 1,
      params,
    }),
  })
}

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
