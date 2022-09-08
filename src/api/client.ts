import { transport } from "./explorer";
import {
    Block,
    InternalTransaction,
    RPCStakingTransactionHarmony,
    RPCTransactionHarmony,
    RelatedTransaction,
    Log, LogDetailed, AddressDetails, ShardID
} from "src/types";
import {
  IHoldersInfo,
  IPairPrice,
  IUserERC721Assets,
  TRelatedTransaction,
} from "./client.interface";
import { ApiCache } from "./ApiCache";
import { get4byteSignatureByHex } from "./3rdPartyApi";
// import { ClientCache } from "./clientCache";

// const clientCache = new ClientCache({
//   timer: 5000, // 15 mins
// });

// TODO: hardcode
let pairCache: { [pair: string]: IPairPrice } = {};
setInterval(() => {
  pairCache = {};
}, 90000);

const signatureHash = new ApiCache({ key: "signatureHashCache" });

export function getBlockByNumber(params: any[]) {
  return transport("getBlockByNumber", params) as Promise<Block>;
}

export function getBlockByHash(params: any[]) {
  return transport("getBlockByHash", params) as Promise<Block>;
}

export function getBlocks(params: any[]) {
  return transport("getBlocks", params) as Promise<Block[]>;
}

export function getCount(params: any[]) {
  return transport("getCount", params) as Promise<{ count: string }>;
}

export function getTransactions(params: any[]) {
  return transport("getTransactions", params) as Promise<
    RPCTransactionHarmony[]
  >;
}

export function getTransactionByField(params: any[]) {
  return transport(
    "getTransactionByField",
    params
  ) as Promise<RPCTransactionHarmony>;
}

export function getStakingTransactionByField(params: [number, "hash", string]) {
  return transport(
    "getStakingTransactionsByField",
    params
  ) as Promise<RPCStakingTransactionHarmony>;
}

export function getInternalTransactionsByField(params: any[]) {
  return transport("getInternalTransactionsByField", params) as Promise<
    InternalTransaction[]
  >;
}

export function getTransactionLogsByField(params: any[]) {
  return transport("getLogsByField", params) as Promise<Log[]>;
}

export function getDetailedTransactionLogsByField(params: any[]) {
  return transport("getDetailedLogsByField", params) as Promise<LogDetailed[]>;
}

export async function getByteCodeSignatureByHash(params: [string]) {
  const [hexValue] = params
  let signature = signatureHash.get(hexValue)
  if (signature) {
    return signature
  }
  signature = await transport("getSignaturesByHash", params)
  if (!signature || signature.length === 0) {
    signature = await get4byteSignatureByHex(hexValue)
  }
  if (signature) {
    signatureHash.set(hexValue, signature);
  }
  return signature
}

export function getRelatedTransactions(params: any[]) {
  return transport("getRelatedTransactions", params) as Promise<
    RelatedTransaction[]
  >;
}

export function getTransactionCountLast14Days() {
  return transport("getTransactionCountLast14Days", []) as Promise<any[]>;
}


export function getWalletsCountLast14Days() {
    return transport("getWalletsCountLast14Days", []) as Promise<any[]>;
}

export function getContractsByField(params: any[]) {
  return transport("getContractsByField", params) as Promise<AddressDetails>;
}

export function getAllERC20() {
  return transport("getAllERC20", []) as Promise<any[]>;
}

export function getAllERC721() {
  return transport("getAllERC721", []) as Promise<any[]>;
}

export function getAllERC1155() {
  return transport("getAllERC1155", []) as Promise<any[]>;
}

export function getUserERC20Balances(params: any[]) {
  return transport("getUserERC20Balances", params) as Promise<any[]>;
}

export function getUserERC721Assets(params: any[]) {
  return transport("getUserERC721Assets", params) as Promise<
    IUserERC721Assets[]
  >;
}

export function getTokenERC721Assets(params: [string]) {
  return transport("getTokenERC721Assets", params) as Promise<
    IUserERC721Assets[]
  >;
}

export function getTokenERC1155Assets(params: [string]) {
  return transport("getTokenERC1155Assets", params) as Promise<
    IUserERC721Assets[]
  >;
}

export function getUserERC1155Balances(params: [string]) {
  return transport("getUserERC1155Balances", params) as Promise<
    {
      tokenID: string;
      ownerAddress: string;
      tokenAddress: string;
      amount: string;
      needUpdate: boolean;
      lastUpdateBlockNumber: number | null;
    }[]
  >;
}

export function getTokenERC1155Balances(params: [string]) {
  return transport("getTokenERC1155Balances", params) as Promise<
    {
      tokenID: string;
      ownerAddress: string;
      tokenAddress: string;
      amount: string;
      needUpdate: boolean;
      lastUpdateBlockNumber: number | null;
    }[]
  >;
}

export function getRelatedTransactionsByType(
  params: [0, string, TRelatedTransaction, any]
) {
  return transport("getRelatedTransactionsByType", params) as Promise<
    RelatedTransaction[]
  >;
}

export function getRelatedTransactionsCountByType(
  params: [0, string, TRelatedTransaction, any]
) {
  return transport("getRelatedTransactionsCountByType", params) as Promise<number>;
}

export function getBinancePairPrice(params: [string]) {
  const cacheValue = pairCache[params[0]];
  return cacheValue
    ? Promise.resolve(cacheValue)
    : transport<IPairPrice>("getBinancePairPrice", params).then((res) => {
        pairCache[params[0]] = res;
        return res;
      });
}

export function getBinancePairHistoricalPrice(params: [string]) {
  return transport("getBinancePairHistoricalPrice", params) as Promise<any[]>;
}

export function getERC20TokenHolders(params: [string, number, number]) {
  return transport("getERC20TokenHolders", params) as Promise<IHoldersInfo[]>;
}

export async function getTokenERC1155AssetDetails(address: string, tokenID: string) {
    const res = await transport("getTokenERC1155AssetDetails", [address, tokenID])
    // todo fix on backend
    return res && res[0]
}

export function getProxyImplementation(params: [ShardID, string]) {
    return transport("getProxyImplementation", params) as Promise<any>;
}

export function assignProxyImplementation(params: [ShardID, string, string]) {
    return transport("assignProxyImplementation", params) as Promise<any>;
}
