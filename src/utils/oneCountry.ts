import { DC } from 'one-country-sdk'
import Web3 from "web3";
import { config } from '../config'

const { oneCountryContractAddress, shardUrls } = config
const provider = new Web3.providers.HttpProvider(shardUrls[0] || '')
const oneCountry = new DC({ provider, contractAddress: oneCountryContractAddress })

export const getAddressByName = async (name: string) => {
    const record = await oneCountry.getRecord(name)
    return record ? record.renter : ''
}
