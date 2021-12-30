import Web3 from "web3";

const web3 = new Web3()

export const parseHexToText = (hex: string) => {
  let text = ''
  try {
    text = web3.utils.hexToUtf8(hex)
    if (text && /[\p{Letter}\p{Mark}]+/gu.test(text)) {
      return text
    }
  } catch (e) {}
  return text
}
