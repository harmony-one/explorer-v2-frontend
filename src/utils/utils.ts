import dayjs from "dayjs";
import Big from "big.js";
import { RelatedTransaction, RelatedTransactionType, RPCTransactionHarmony, TransactionExtraMark } from "../types";
import { getAddress } from "./getAddress/GetAddress";
import { bridgeTokensMap } from "src/config";

export const getQueryVariable = (variable: string, query: string) => {
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
};

export const isTokenBridged = (address: string) => !!bridgeTokensMap[address]

export const copyTextToClipboard = (value: string) => {
  const copyTextareaInput = document.createElement("textarea");
  copyTextareaInput.value = value;
  document.body.appendChild(copyTextareaInput);

  copyTextareaInput.focus();
  copyTextareaInput.select();

  try {
    document.execCommand("copy");
  } catch {
  } finally {
    document.body.removeChild(copyTextareaInput);
  }
};

export const mapBlockchainTxToRelated = (
  tx: RPCTransactionHarmony,
  type: RelatedTransactionType = 'transaction'
): RelatedTransaction => {
  const resultedTx = {
    ...tx,
    transactionType: type,
    address: '',
    transactionHash: tx.ethHash || tx.hash,
    timestamp: dayjs(+tx.timestamp * 1000).toString(),
    extraMark: TransactionExtraMark.normal
  }
  if (tx.from) {
    resultedTx.from = getAddress(tx.from).basicHex
  }
  if (tx.to) {
    resultedTx.to = getAddress(tx.to).basicHex
  }
  if (typeof tx.value !== 'undefined') {
    resultedTx.value = Big(tx.value).toString()
  }
  return resultedTx
}

export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;

  if (an === 0) {
    return bn;
  }

  if (bn === 0) {
    return an;
  }

  const matrix = new Array<number[]>(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    let row = matrix[i] = new Array<number>(an + 1);
    row[0] = i;
  }

  const firstRow = matrix[0];
  for (let j = 1; j <= an; ++j) {
    firstRow[j] = j;
  }

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j)
    {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1], // substitution
          matrix[i][j - 1], // insertion
          matrix[i - 1][j] // deletion
        ) + 1;
      }
    }
  }
  return matrix[bn][an];
}
