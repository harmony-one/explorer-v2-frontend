import React, { useEffect } from "react";
import {
  Erc20Price,
    setBinancePairHistoricalPrice,
  useBinancePairHistoricalPrice,
} from "src/hooks/BinancePairHistoricalPrice";

export function BinancePairHistoricalPrice_Pool() {
  useEffect(() => {
    const getRates = async () => {
      const erc20: Erc20Price[] = useBinancePairHistoricalPrice();
      const erc20MapPrice = {} as Record<string, Erc20Price>;
      erc20.forEach((i) => {
        erc20MapPrice[i.hrc20Address] = i;
      });

      window.localStorage.setItem(
        "BinancePairHistoricalPrice",
        JSON.stringify(erc20MapPrice)
      );
      setBinancePairHistoricalPrice(erc20);
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
