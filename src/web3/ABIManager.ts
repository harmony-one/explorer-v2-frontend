import {ByteCode, Address} from 'src/types'
import Web3 from 'web3'

type ABIEntry = {
  name: string
  type: 'event' | 'function'
  inputs: {name: string; type: 'string'; indexed: boolean}[]
  outputs: {name: string; type: 'string'}[] | undefined
}

export type IABI = ABIEntry[]

const web3 = new Web3()

export const ABIManager = (abi: IABI) => {
  const entries = abi
    .filter(({type}) => ['function', 'event'].includes(type))
    .map((e) => {
      let signature = ''
      if (e.type === 'function') {
        signature = web3.eth.abi.encodeFunctionSignature(e)
      } else if (e.type === 'event') {
        signature = web3.eth.abi.encodeEventSignature(e)
      }

      if (e.type === 'function' && !e.outputs) {
        throw new Error(`ABI outputs definition expected for function "${e.name}"`)
      }

      return {
        name: e.name,
        type: e.type,
        signature,
        signatureWithout0x: signature.slice(2),
        outputs: e.outputs ? e.outputs.map((e) => e.type) : [],
        inputs: e.inputs,
      }
    })

  const getEntryByName = (name: string) => entries.find((e) => e.name === name)

  const hasAllSignatures = (names: string[], hexData: ByteCode) =>
    names.reduce((acc, name) => {
      const entry = getEntryByName(name)
      if (!entry || !entry.signatureWithout0x) {
        return false
      }

      return hexData.indexOf(entry.signatureWithout0x) !== -1 && acc
    }, true)

  const getMatchingSignatures = (names: string[], hexData: ByteCode) =>
    names.filter((name) => {
      const entry = getEntryByName(name)
      if (!entry || !entry.signatureWithout0x) {
        return false
      }
      return hexData.indexOf(entry.signatureWithout0x) !== -1
    })

  const decodeLog = (inputName: string, data: ByteCode, topics: string[]) => {
    const event = abi.find((e) => e.name === inputName)
    if (!event) {
      throw new Error(`No input for event "${inputName}"`)
    }

    return web3.eth.abi.decodeLog(event.inputs, data, topics)
  }

  return {
    abi: entries,
    getEntryByName,
    hasAllSignatures,
    getMatchingSignatures,
    decodeLog,
  }
}
