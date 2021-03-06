import { default as bridgeTokens } from "src/config/bridgeTokensMap.json";
import { default as addressAliases } from "src/config/addressAliasMap.json";
import { ShardID } from "../types";

interface AddressMap {
  [key: string]: { name: string, link: string, description?: string }
}

const mapKeysToLowerCase = (input: AddressMap): AddressMap => {
  if (typeof input !== 'object') return input;
  return Object.keys(input).reduce(function (newObj: Record<string, any>, key) {
    newObj[key.toLowerCase()] = input[key]
    return newObj;
  }, {});
};

export const bridgeTokensMap: Record<string, string> = bridgeTokens || {}
export const addressAliasMap: AddressMap = mapKeysToLowerCase(addressAliases) || {}

export const config = {
  availableShards: (process.env.REACT_APP_AVAILABLE_SHARDS || '')
    .split(",")
    .map((t) => +t) as ShardID[]
}
