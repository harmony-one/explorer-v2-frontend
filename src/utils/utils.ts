import dayjs from "dayjs";
import { RelatedTransaction, RelatedTransactionType, RPCTransactionHarmony } from "../types";
import { getAddress } from "./getAddress/GetAddress";

export const getQueryVariable = (variable: string, query: string) => {
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
};

/* Blockchain TX
blockHash: "0xefab387ae7dc5165496f8fc1a47b2d761a64a4fcafa2ad6e0159161e292ab9cc"
blockNumber: 20654156
ethHash: "0xd69fa039eb7f8bb0a71110e0e54f0afc048bd46b84872ac165751aa45d870aef"
from: "one1wx6p8kjucu5llqz79h9pmn0qf55772m2d2xt26"
gas: 50000
gasPrice: 150000000000
hash: "0xdb3659cdc89b48d1ca55db41e70e38e65a087313ca37c22c612b447cb33f99a9"
input: "0x"
nonce: 429822
r: "0x725bc833390cfe396e8a4a4bf99196e629044ff10ecc9ab68e5c10e85dcbb34e"
s: "0x69d38e99e677a4b7c8a4fb90ffdb5612daf23f54b56cb593776628394762b6fb"
shardID: 0
timestamp: 1639849575
to: "one1jhgza9na6tftrqunglstsnjezd43rgrn8ujcty"
toShardID: 0
transactionIndex: 0
v: "0x26"
value: 101998000000000000000
* */


/*
*
blockHash: "0xefab387ae7dc5165496f8fc1a47b2d761a64a4fcafa2ad6e0159161e292ab9cc"
blockNumber: "20654156"
error: null
from: "0x71b413da5cc729ff805e2dca1dcde04d29ef2b6a"
gas: "50000"
gasPrice: "150000000000"
hash: "0xd69fa039eb7f8bb0a71110e0e54f0afc048bd46b84872ac165751aa45d870aef"
hash_harmony: "0xdb3659cdc89b48d1ca55db41e70e38e65a087313ca37c22c612b447cb33f99a9"
input: "0x"
nonce: 429822
r: "0x725bc833390cfe396e8a4a4bf99196e629044ff10ecc9ab68e5c10e85dcbb34e"
s: "0x69d38e99e677a4b7c8a4fb90ffdb5612daf23f54b56cb593776628394762b6fb"
shardID: 0
success: null
timestamp: "2021-12-18T17:46:15.000Z"
to: "0x95d02e967dd2d2b1839347e0b84e59136b11a073"
toShardID: 0
transactionIndex: 0
v: "0x26"
value: "101998000000000000000"
* */

export const mapBlockchainTxToRelated = (
  tx: RPCTransactionHarmony,
  type: RelatedTransactionType = 'transaction'
): RelatedTransaction => {
  const resultedTx = {
    ...tx,
    transactionType: type,
    address: '',
    transactionHash: tx.ethHash || tx.hash,
    from: getAddress(tx.from).basicHex,
    timestamp: dayjs(+tx.timestamp * 1000).toString()
  }
  if (tx.to) {
    resultedTx.to = getAddress(tx.to).basicHex
  }
  if (tx.value) {
    resultedTx.value = BigInt(tx.value).toString()
  }
  return resultedTx
}
