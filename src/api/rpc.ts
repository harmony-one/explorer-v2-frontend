import JSONBig from 'json-bigint'
import { ERC1155_Pool } from "src/hooks/ERC1155_Pool";
import { ERC20_Pool } from "src/hooks/ERC20_Pool";
import { ERC721_Pool } from "src/hooks/ERC721_Pool";
import { HarmonyAddress } from "src/utils";
import { convertTxnToObj, filterTransactions, hasAllowance, matchesApprovalMethod } from "src/utils/approvals";
import {
  ApprovalDetails,
  IGetTxsHistoryParams,
  RequestOrder,
  RequestTxType,
  RPCTransactionHarmony,
  StakingDelegationResponse,
  TokenType,
  TxReceipt
} from "../types";
import { config } from "../config";

export type TRPCResponse<T> = { id: number; jsonrpc: "2.0"; result: T, error?: { code: number, message: string } };

const API_URL = process.env.REACT_APP_RPC_URL_SHARD0 || 'https://a.api.s0.t.hmny.io/';

export const rpcAdapter = <T = any>(...args: Parameters<typeof fetch>) => {
  /**
   * wrapper for fetch. for some middleware in future requests
   */

  return fetch
    .apply(window, args)
    .then((res) => res.json()) as unknown as Promise<T>;
};

/**
 * BigInt values will be stored as strings
 */
export const rpcBigIntAdapter = <T = any>(...args: Parameters<typeof fetch>) => {
  return fetch
    .apply(window, args)
    .then((res) => res.text())
    .then((res) => JSONBig({ storeAsString: true }).parse(res)) as unknown as Promise<T>;
};

export const getBalance = (nodeUrl: string, params: [string, "latest"]) => {
  return rpcAdapter<TRPCResponse<string>>(nodeUrl, {
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
  return rpcAdapter<TRPCResponse<TxReceipt>>(
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
  const getBalanceHandler = async (nodeUrl: string) => {
    try {
      const { result } = await getBalance(nodeUrl, params)
      return result
    } catch (e) {
      return '0x0'
    }
  }
  return Promise.all(config.shardUrls.map(shardUrl => getBalanceHandler(shardUrl)));
};

const defaultGetHistoryParams = {
  fullTx: true,
  txType: RequestTxType.ALL,
  order: RequestOrder.DESC
}

export const eth_traceTransaction = (hash: string) => {
  return rpcAdapter<any>(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "trace_transaction",
      id: 1,
      params: [hash],
    }),
  }).then(data => {
    if (data.error) {
      throw new Error(data.error.message)
    }
    return data.result
  });
}

export const hmyv2_getTransactionsHistory = (params: IGetTxsHistoryParams[]) => {
  return rpcAdapter<TRPCResponse<{ transactions: RPCTransactionHarmony[] }>>(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "hmyv2_getTransactionsHistory",
      id: 1,
      params: [{ ...defaultGetHistoryParams, ...params[0] }],
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

export const hmyv2_getNodeMetadata = (shard: string) => {
  return rpcAdapter<TRPCResponse<any>>(getApiUrl(shard), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "hmyv2_getNodeMetadata",
      id: 1,
      params: [],
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
      params: [{ ...defaultGetHistoryParams, ...params[0] }],
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

export interface StakingDelegation {
  undelegations: Array<{amount: string, epoch: string}>,
  amount: string,
  delegatorAddress: string,
  reward: string,
  validatorAddress: string
}

const mapStakingDelegation = (delegation: StakingDelegationResponse): StakingDelegation => {
  return {
    undelegations: delegation.Undelegations.map((undelegation) => {
      return {
        amount: undelegation.Amount,
        epoch: undelegation.Epoch
      }
    }),
    amount: delegation.amount,
    delegatorAddress: delegation.delegator_address,
    reward: delegation.reward,
    validatorAddress: delegation.validator_address
  }
}

export const hmy_getDelegationsByDelegator = (address: string): Promise<StakingDelegation[]> => {
  return rpcBigIntAdapter<TRPCResponse<StakingDelegationResponse[]>>(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "hmy_getDelegationsByDelegator",
      id: 1,
      params: [address],
    }),
  }).then(data => {
    if (data.error) {
      throw new Error(data.error.message)
    }
    return data.result.map(mapStakingDelegation)
  });
};

/**
 * Given address get all the approvals made by this address for all types of ERC1155, ERC721, and ERC20 tokens.
 * Supply optional contractAddress argument to filter to only the specified token.
 *
 * Use pageIndex and pageSize to control how many events to load from the RPC, supply txnHistory to remove previous
 *
 * @param address
 * @param contractAddress
 * @param pageIndex
 * @param pageSize
 * @param txnHistory
 */
export const getAllApprovalsForTokens = async (address: string,
  contractAddress: string = "",
  pageIndex = 0,
  pageSize = 100,
  txnHistory: any[] = [],
  erc20Pool: ERC20_Pool = {},
  erc1155Pool: ERC1155_Pool = {},
  erc721Pool: ERC721_Pool = {}
): Promise<{ txnHistory: ApprovalDetails[], dataObj: RPCTransactionHarmony[] }> => {
  const params: IGetTxsHistoryParams[] = [{
    address,
    pageIndex,
    pageSize,
    fullTx: true,
    txType: RequestTxType.SENT,
    order: RequestOrder.ASC
  }];

  // if null, return all approvals
  const contractHarmonyAddr = contractAddress && contractAddress.length > 0 ? new HarmonyAddress(contractAddress) : null;

  let dataObj: RPCTransactionHarmony[] = await hmyv2_getTransactionsHistory(params);

  for (let tx of dataObj) {
    if (matchesApprovalMethod(tx) && (tx.to === contractAddress || tx.to === contractHarmonyAddr?.bech32 || !contractHarmonyAddr)) {
      const spender = "0x" + tx.input.substring(34, 74);
      const to = new HarmonyAddress(tx.to).basicHex;
      let type: TokenType = "ERC20";
      if (erc1155Pool[to]) {
        type = "ERC1155";
      }
      else if (erc721Pool[to]) {
        type = "ERC721";
      }
      // remove from list
      txnHistory = filterTransactions(tx, txnHistory, spender, erc20Pool, erc1155Pool, erc721Pool);
      //txnHistory.filter(transaction => !(transaction.spender === spender && transaction.contract === tx.to)) // remove from list txn spender AND contract matches...
      if (hasAllowance(tx, spender, type)) {
        const approvedObj = convertTxnToObj(tx, type);
        txnHistory.push(approvedObj);
      }
    }
  }

  return { txnHistory, dataObj };
}

const getApiUrl = (shard: string) => {
  switch (shard) {
    case "1": 
      return process.env.REACT_APP_RPC_URL_SHARD1 || 'https://a.api.s1.t.hmny.io/'
    case "2":
      return process.env.REACT_APP_RPC_URL_SHARD2 || 'https://a.api.s2.t.hmny.io/'
    case "3":
      return process.env.REACT_APP_RPC_URL_SHARD3 || 'https://a.api.s3.t.hmny.io/'
    default:
      return process.env.REACT_APP_RPC_URL_SHARD0 || 'https://a.api.s0.t.hmny.io/'
  }
}
