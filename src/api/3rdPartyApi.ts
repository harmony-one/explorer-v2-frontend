import { IHexSignature } from "../types";

const fourByteApiUrl = 'https://www.4byte.directory/api/v1'

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
