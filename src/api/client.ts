import { transport } from "./explorer";
import {
    Block,
    InternalTransaction,
    RPCStakingTransactionHarmony,
    RPCTransactionHarmony,
    RelatedTransaction,
    Log, LogDetailed, AddressDetails,
    ShardID, MetricsType, MetricsDailyItem, MetricsTopType, MetricsTopItem, MetricsTopPeriod
} from "src/types";
import {
  IERC1155Balance,
  IHoldersInfo,
  IPairPrice,
  IUserERC721Assets,
  TRelatedTransaction,
} from "./client.interface";
import { ApiCache } from "./ApiCache";
import { get4byteSignatureByHex } from "./3rdPartyApi";
import { eth_traceTransaction } from './rpc'
// import { ClientCache } from "./clientCache";

// const clientCache = new ClientCache({
//   timer: 5000, // 15 mins
// });

// TODO: hardcode
let pairCache: { [pair: string]: IPairPrice } = {};
const contractShardID = process.env.REACT_APP_CONTRACT_SHARD  ? (+process.env.REACT_APP_CONTRACT_SHARD || 0) : 0

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

export function getInternalTransactionsByField(params: any[], blockNumber?: string) {
  // fallback to rpc as we don't keep old records older than 34000000 any more in postgres
  if (!blockNumber || +blockNumber < 34000000) {
    const queryType = params[1]
    if (queryType !== 'transaction_hash') {
      console.error('use only transaction hash to get internal transactions')
      return [] as InternalTransaction[]
    }

    const txHash = params[2]
    //
    console.info('internal transactions is not available to serve')
    return [] as InternalTransaction[]
    // todo note check error field may not work properly
    /* return eth_traceTransaction(txHash).then(txs => {
      const mapTxs = txs.map((tx: any, i: number) => ({
        type: tx.action.type || tx.type,
        value: tx.value,
        input: tx.action.input,
        output: tx.result.output,
        transactionHash: tx.transactionHash,
        gasUsed: tx.result.gasUsed,
        index: i,
        to: tx.action.to,
        from: tx.action.from,
        error: tx.result.error,
        gas: tx.action.gas
      }))
      return mapTxs as InternalTransaction[]
    }) */
  }

  return transport("getInternalTransactionsByField", params) as Promise<InternalTransaction[]>;
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

export function getTransactionCountLast14Days(limit = 14) {
  return transport("getTransactionCountLast14Days", [limit]) as Promise<any[]>;
}


export function getWalletsCountLast14Days(limit = 14) {
    return transport("getWalletsCountLast14Days", [limit]) as Promise<any[]>;
}

export function getMetricsByType(type: MetricsType, offset = 0, limit = 14) {
    return transport("getMetricsByType", [type, offset, limit]) as Promise<MetricsDailyItem[]>;
}

export function getTopMetricsByType(type: MetricsTopType, period: MetricsTopPeriod, limit = 10) {
    return transport("getTopMetricsByType", [type, period, limit]) as Promise<MetricsTopItem[]>;
}

export function getContractsByField(params: any[]) {
  return transport("getContractsByField", params) as Promise<AddressDetails>;
}

export function getAllERC20() {
  return transport("getAllERC20", [contractShardID]) as Promise<any[]>;
}

export function getAllERC721() {
  return transport("getAllERC721", [contractShardID]) as Promise<any[]>;
}

export function getAllERC1155() {
  return transport("getAllERC1155", [contractShardID]) as Promise<any[]>;
}

export function getUserERC20Balances(params: any[]) {
  return transport("getUserERC20Balances", [contractShardID, ...params]) as Promise<any[]>;
}

export function getUserERC721Assets(params: any[]) {
  return transport("getUserERC721Assets", [contractShardID, ...params]) as Promise<
    IUserERC721Assets[]
  >;
}

export function getTokenERC721Assets(params: [string]) {
  return transport("getTokenERC721Assets", [contractShardID, ...params]) as Promise<
    IUserERC721Assets[]
  >;
}

export async function getTokenERC721AssetDetails(address: string, tokenID: string) {
  return transport("getTokenERC721AssetDetails", [contractShardID, address, tokenID])
}

export function getTokenERC1155Assets(params: [string]) {
  return transport("getTokenERC1155Assets", [contractShardID, ...params]) as Promise<
    IUserERC721Assets[]
  >;
}

export function getUserERC1155Balances(params: [string]) {
  return transport("getUserERC1155Balances", [contractShardID, ...params]) as Promise<IERC1155Balance[]>;
}

export function getTokenERC1155Balances(params: [string]) {
  return transport("getTokenERC1155Balances", [contractShardID, ...params]) as Promise<IERC1155Balance[]>;
}

export function getRelatedTransactionsByType(
  params: [number, string, TRelatedTransaction, any]
) {
  return transport("getRelatedTransactionsByType", [contractShardID, params[1], params[2], params[3]]) as Promise<
    RelatedTransaction[]
  >;
}

export function getRelatedTransactionsCountByType(
  params: [number, string, TRelatedTransaction, any]
) {
  return transport("getRelatedTransactionsCountByType", [contractShardID, params[1], params[2], params[3]]) as Promise<number>;
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
  return transport("getERC20TokenHolders", [contractShardID, ...params]) as Promise<IHoldersInfo[]>;
}

export async function getTokenERC1155AssetDetails(address: string, tokenID: string) {
    const res = await transport("getTokenERC1155AssetDetails", [contractShardID, address, tokenID])
    // todo fix on backend
    return res && res[0]
}
