import React, { useEffect } from "react";
import { getAllERC721 } from "src/api/client";
import { setERC721Pool, ERC721 } from "src/hooks/ERC721_Pool";

export function ERC721_Pool() {
  useEffect(() => {
    const getRates = async () => {
      const erc721: ERC721[] = await getAllERC721();
      const erc721Map = {} as Record<string, ERC721>;
      erc721.forEach((i: any) => {
        erc721Map[i.address] = i;
      });

      window.localStorage.setItem("ERC721_Pool", JSON.stringify(erc721Map));
      setERC721Pool(erc721Map);
    };

    let tId = 0;

    setTimeout(() => {
      getRates();
      // console.log("GET 721");
      tId = window.setInterval(getRates, 10 * 60 * 1e3);
    });

    return () => {
      clearTimeout(tId);
    };
  }, []);

  return null;
}
