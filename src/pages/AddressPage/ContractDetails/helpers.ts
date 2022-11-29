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

export const getContractByAddress = async (contractId: string) => {
  const { contractShardId } = config

  let contract = null
  try {
    contract = await getContractsByField([contractShardId, "address", contractId]);
  } catch (_) {}
  return {
    contract,
    shardId: contractShardId
  }
}
