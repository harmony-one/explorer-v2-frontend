import React, { useEffect } from "react";
import { getAllERC721 } from "src/api/client";
import { setERC721Pool, ERC721 } from "src/hooks/ERC721_Pool";
import { getTabHidden, useWindowFocused } from "src/hooks/useWindowFocusHook";
import { IndexedDbKeyPath, IndexedDbStore, saveToIndexedDB } from "../utils/indexedDB";
import { isTokenBridged } from "../utils";

const updateTokensInterval = 1000 * 60 * 10

export function ERC721_Pool() {
  const focus = useWindowFocused();

  useEffect(() => {
    let tId = 0;

    const getTokens = async () => {
      try {
        if (getTabHidden()) {
          return; // tab is hidden don't refresh
        }
        let erc721: ERC721[] = await getAllERC721();
        const erc721Map = {} as Record<string, ERC721>;
        erc721 = erc721.map((item) => {
          erc721Map[item.address] = {
            ...item,
            decimals: item.decimals || 0,
            isBridged: isTokenBridged(item.address)
          };
          return {
            [IndexedDbKeyPath]: item.address,
            ...item
          }
        });
        setERC721Pool(erc721Map);
        await saveToIndexedDB(IndexedDbStore.ERC721Pool, erc721)
        localStorage.setItem(IndexedDbStore.ERC721Pool, Date.now().toString())
        console.log(`ERC721 tokens is updated, count: ${erc721.length}`)
      } catch (e) {
        console.error('Cannot update ERC721 tokens', (e as Error).message)
      } finally {
        clearTimeout(tId);
        tId = window.setTimeout(getTokens, 10 * 60 * 1e3);
      }
    };

    const lastLoadTimestamp = +(window.localStorage.getItem(IndexedDbStore.ERC721Pool) || 0)
    const timeToTextUpdate = lastLoadTimestamp + updateTokensInterval - Date.now()
    if(timeToTextUpdate < 0) {
      getTokens()
    } else {
      console.log(`ERC721 tokens pool is up to date, next update in ${Math.floor((timeToTextUpdate) / 60 / 1000)} min`)
    }

    return () => {
      clearTimeout(tId);
    };
  }, []);

  return null;
}
