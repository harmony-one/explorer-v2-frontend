import React, { useEffect } from "react";
import { getAllERC20 } from "src/api/client";
import { setERC20Pool, Erc20 } from "src/hooks/ERC20_Pool";

export function ERC20_Pool() {
  useEffect(() => {
    const getRates = async () => {
      const erc20: Erc20[] = await getAllERC20();
      const erc20Map = {} as Record<string, Erc20>;
      erc20.forEach((i: any) => {
        erc20Map[i.address] = i;
      });

      window.localStorage.setItem("ERC20_Pool", JSON.stringify(erc20Map));
      setERC20Pool(erc20Map);
    };

    let tId = 0;

    setTimeout(() => {
      getRates();
      tId = window.setInterval(getRates, 10 * 60 * 1e3);
    });

    return () => {
      clearTimeout(tId);
    };
  }, []);

  return null;
}
