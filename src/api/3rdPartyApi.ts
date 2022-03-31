import dayjs from "dayjs";
import { IHexSignature } from "../types";

const fourByteApiUrl = 'https://www.4byte.directory/api/v1'
const MetricsApiUrl = process.env.REACT_APP_METRICS_API_URL || ''

interface I4BytesSignatureResult {
  id: number;
  created_at: string;
  text_signature: string;
  hex_signature: string;
  bytes_signature: string;
}

interface I4BytesSignatureResponse {
  count: number;
  next: null;
  previous: null;
  results: I4BytesSignatureResult[];
}

export const get4byteSignatureByHex = async (hex: string): Promise<IHexSignature[]> => {
  const { results }: I4BytesSignatureResponse = await(
    await window.fetch(`${fourByteApiUrl}/signatures/?hex_signature=${hex}`)
  ).json()

  const [result] = results
  if(!result) {
    return []
  }
  return [{
    hash: result.hex_signature,
    signature: result.text_signature
  }]
}

interface ActiveWalletsResponseItem {
  ACTIVE_WALLETS: number
  DATE: string
  GROWTH_RATE: number | null
}

export interface ActiveWalletResponse {
  date: string
  count: string
}

export const getActiveWallets = async (count = 14): Promise<ActiveWalletResponse[]> => {
  const response = await window.fetch(`${MetricsApiUrl}/api/v2/queries/532a5af5-7dc5-4446-be20-ff83a5f32d45/data/latest`)
  const items: ActiveWalletsResponseItem[] = await(response.json())
  return items
    .map(({ DATE, ACTIVE_WALLETS }) => {
      return {
        date: dayjs(DATE).format('YYYY-MM-DD'),
        count: ACTIVE_WALLETS.toString()
      }
    })
    .slice(-(count + 1)) // Wallets API return more rows that we needed
}

interface TransactionsCountResponseItem {
  COUNT: string
  DATE: string
  LABEL: string
}

export interface TransactionsCountResponse {
  timestamp: string
  count: string
}

export const getTransactionsCount = async (count = 14): Promise<TransactionsCountResponse[]> => {
  const response = await window.fetch(`${MetricsApiUrl}/api/v2/queries/8b1f7226-995c-4091-acc6-84a7f70b9833/data/latest`)
  const items: TransactionsCountResponseItem[] = await(response.json())
  return items
    .map(({ DATE, COUNT }) => {
      return {
        timestamp: dayjs(DATE).format('YYYY-MM-DD'),
        count: COUNT.toString()
      }
    })
    .slice(-(count + 1)) // Wallets API return more rows that we needed
}
