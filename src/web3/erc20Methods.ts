import Web3 from "web3";
import ERC20ABI from './abi/ERC20ABI.json'
import { AbiItem } from "web3-utils";

const web3URL = process.env.REACT_APP_RPC_URL_SHARD0 as string

const web3 = new Web3(web3URL);

export function getERC20Balance(walletAddress: string, tokenAddress: string) {
  let contract = new web3.eth.Contract(ERC20ABI as AbiItem[], tokenAddress);
  return contract.methods.balanceOf(walletAddress).call();
}

