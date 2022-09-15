import { AbiInput } from "web3-utils";
import { getAddress } from "src/utils";
import {config} from "../../../config";
import {getContractsByField} from "../../../api/client";

export const convertInputs = (inputs: string[], abiInputs: AbiInput[]) => {
  return inputs.map((value, idx) => {
    switch (abiInputs[idx].type) {
      case "address":
        return getAddress(value).basicHex;

      default:
        return value;
    }
  });
};

export const getContractInAllShards = async (contractId: string) => {
  const { availableShards } = config

  let contract = null
  let shardId = null

  for(let i = 0; i < availableShards.length; i++) {
    try {
      const sId = availableShards[i]
      contract = await getContractsByField([sId, "address", contractId]);
      if (contract) {
        shardId = sId
        break
      }

      // Temp optimization to reduce number of requests
      if(sId === 1) {
        break
      }
    } catch (_) {}
  }

  return {
    contract,
    shardId
  }
}
