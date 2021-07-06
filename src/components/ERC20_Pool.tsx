import React, { useEffect } from "react";
import { getAllERC20 } from "src/api/client";
import { setERC20Pool, Erc20 } from "src/hooks/ERC20_Pool";

export function ERC20_Pool() {
  useEffect(() => {
    let tId = 0;

    const getRates = async () => {
      try {
        const erc20: Erc20[] = await getAllERC20();
        const erc20Map = {} as Record<string, Erc20>;
        erc20.forEach((i: any) => {
          erc20Map[i.address] = i;
        });

        window.localStorage.setItem("ERC20_Pool", JSON.stringify(erc20Map));
        setERC20Pool(erc20Map);
      } catch {
        setERC20Pool({});
      } finally {
        window.clearTimeout(tId);
        tId = window.setTimeout(getRates, 10 * 60 * 1e3);
      }
    };

    tId = window.setTimeout(
      () => {
        getRates();
      },
      window.localStorage.getItem("ERC20_Pool") ? 2000 : 0
    );

    return () => {
      clearTimeout(tId);
    };
  }, []);

  return null;
}
