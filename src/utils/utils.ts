import dayjs from "dayjs";
import { RelatedTransaction, RelatedTransactionType, RPCTransactionHarmony } from "../types";
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
