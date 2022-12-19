import { OneCountry } from 'one-country-sdk'
import Web3 from "web3";
import { config } from '../config'

const { oneCountryContractAddress, shardUrls } = config
const provider = new Web3.providers.HttpProvider(shardUrls[0] || '')
const oneCountry = new OneCountry({ provider, contractAddress: oneCountryContractAddress })

export const getAddressByName = async (name: string) => {
    const record = await oneCountry.getRecordByName(name)
    return record ? record.renter : ''
}
