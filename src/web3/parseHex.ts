import Web3 from "web3";

const web3 = new Web3()

export const parseHexToText = (hex: string) => {
  let text = ''
  try {
    text = web3.utils.hexToUtf8(hex)
    // Allow only english letters and some symbols
    if (text && /^[A-Za-z0-9,.;\- ]*$/.test(text)) {
      return text
    }
  } catch (e) {}
  return text
}
