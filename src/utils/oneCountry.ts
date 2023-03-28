import { DCEns } from 'one-country-sdk'
import Web3 from "web3";
import { config } from '../config'
import {keccak256} from "./getAddress/keccak256";

export const OneCountryTLD = '.country'
const OneCountryTLDNode = '0xad4be81514036b9f6ff6c5f69394daacc516c82bd6dc4756d7f6ef1b3f9ea717'


const { oneCountryContractAddress, shardUrls } = config
const provider = new Web3.providers.HttpProvider(shardUrls[0] || '')
const oneCountry = new DCEns({ provider, contractAddress: oneCountryContractAddress })

export const getAddressByName = async (name: string) => {
    const record = await oneCountry.getRecord(name)
    return record ? record.renter : ''
}

export const convertErc721TokenId = (erc721TokenId: string) => {
    let labelHash = Web3.utils.toBN(erc721TokenId).toString('hex', 64)
    labelHash = '0x' + labelHash
    const encodePacked = Web3.utils.encodePacked(
      {value: OneCountryTLDNode, type: 'bytes32'},
      {value: labelHash, type: 'bytes32'},
    ) || '';
    return Web3.utils.toBN(keccak256(encodePacked)).toString()
}
