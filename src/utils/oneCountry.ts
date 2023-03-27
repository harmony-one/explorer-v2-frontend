import { DCEns } from 'one-country-sdk'
import Web3 from "web3";
import { config } from '../config'

export const OneCountryTLD = '.country'

const { oneCountryContractAddress, shardUrls } = config
const provider = new Web3.providers.HttpProvider(shardUrls[0] || '')
const oneCountry = new DCEns({ provider, contractAddress: oneCountryContractAddress })

export const getAddressByName = async (name: string) => {
    const record = await oneCountry.getRecord(name)
    return record ? record.renter : ''
}
