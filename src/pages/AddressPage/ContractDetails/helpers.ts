import { AbiInput } from "web3-utils";
import { getAddress } from "src/utils";

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
