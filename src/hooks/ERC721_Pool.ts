import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import { IndexedDbStore, loadFromIndexedDB } from "../utils/indexedDB";
import { isTokenBridged } from "../utils";

const initValue: ERC721_Pool = {};

let globalSetMode = () => {
  return {};
};

export const useERC721Pool = singletonHook(initValue, () => {
  const getPool = async () => {
    try {
      const erc721 = await loadFromIndexedDB(IndexedDbStore.ERC721Pool)
      const erc721Map = {} as Record<string, ERC721>;
      erc721.forEach(item => {
        erc721Map[item.address] = {
          ...item,
          isBridged: isTokenBridged(item.address)
        };
      })
      setMode(erc721Map)
    } catch (e) {
      console.error('Cannot get ERC721 records: ', (e as Error).message)
    }
  }

  useEffect(() => {
    getPool()
  }, [])

  const [mode, setMode] = useState<ERC721_Pool>(initValue);
  //@ts-ignore
  globalSetMode = setMode;
  return mode;
});

export const setERC721Pool = (pool: ERC721_Pool) => {
  //@ts-ignore
  globalSetMode(pool);
};

export interface ERC721 {
  name: string;
  address: string;
  totalSupply: string;
  holders: string;
  decimals: number;
  symbol: string;
  isBridged: boolean;
}

export type ERC721_Pool = Record<string, ERC721>;
