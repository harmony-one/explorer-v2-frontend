import { default as bridgeTokens } from "src/config/bridgeTokensMap.json";
import { default as addressAliases } from "src/config/addressAliasMap.json";

export const config = {}

export const bridgeTokensMap: Record<string, string> = bridgeTokens || {}
export const addressAliasMap: Record<string, { name: string, link: string, description?: string }> = addressAliases || {}
