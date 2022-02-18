import React, { useEffect } from "react";
import { getAllERC721 } from "src/api/client";
import { setERC721Pool, ERC721 } from "src/hooks/ERC721_Pool";
import { getTabHidden, useWindowFocused } from "src/hooks/useWindowFocusHook";
import { IndexedDbKeyPath, IndexedDbStore, saveToIndexedDB } from "../utils/indexedDB";
import { isTokenBridged } from "../utils";

export function ERC721_Pool() {
  const focus = useWindowFocused();

  useEffect(() => {
    let tId = 0;

    const getRates = async () => {
      try {
        if (getTabHidden()) {
          return; // tab is hidden don't refresh
        }
        let erc721: ERC721[] = await getAllERC721();
        const erc721Map = {} as Record<string, ERC721>;
        erc721 = erc721.map((item) => {
          erc721Map[item.address] = {
            ...item,
            isBridged: isTokenBridged(item.address)
          };
          return {
            [IndexedDbKeyPath]: item.address,
            ...item
          }
        });
        setERC721Pool(erc721Map);
        await saveToIndexedDB(IndexedDbStore.ERC721Pool, erc721)
        localStorage.setItem(IndexedDbStore.ERC721Pool, '1')
        console.log(`ERC721 tokens is updated, count: ${erc721.length}`)
      } catch (e) {
        console.error('Cannot update ERC721 tokens', (e as Error).message)
      } finally {
        clearTimeout(tId);
        tId = window.setTimeout(getRates, 10 * 60 * 1e3);
      }
    };

    tId = window.setTimeout(
      () => {
        getRates();
      },
      window.localStorage.getItem(IndexedDbStore.ERC721Pool) ? 2100 : 0
    );

    return () => {
      clearTimeout(tId);
    };
  }, []);

  return null;
}
