import Big from "big.js";
import React from "react";
import { useONEExchangeRate } from "src/hooks/useONEExchangeRate";

export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  if (num === undefined) return "";

  return num.toLocaleString("en-US", options);
}

export function reintervate(
  func: () => any,
  interval: number
): number | Promise<number> {
  const res = func();
  if (res instanceof Promise) {
    return res.then(() =>
      window.setTimeout(() => reintervate(func, interval), interval)
    );
  } else {
    return window.setTimeout(() => reintervate(func, interval), interval);
  }
}

Big.DP = 21;
Big.NE = -20;
Big.PE = 15;

export function CalculateFee(transaction: any) {
  const { lastPrice } = useONEExchangeRate();

  const fee =
    isNaN(transaction.gas) || isNaN(transaction.gasPrice)
      ? 0
      : (Number(transaction.gas) * Number(transaction.gasPrice)) /
        10 ** 14 /
        10000;

  const normolizedFee = Intl.NumberFormat("en-US", {
    maximumFractionDigits: 18,
  }).format(fee);

  const price = lastPrice;

  const bi =
    ((Big(normolizedFee) as unknown) as number) /
    ((Big(10 ** 14) as unknown) as any);
  const v = parseInt(bi.toString()) / 10000;
  let USDValue = "";

  if (price && v > 0) {
    USDValue = (v * +price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currency: "USD",
    });
  }

  return (
    <>
      {Intl.NumberFormat("en-US", { maximumFractionDigits: 18 }).format(fee)}
      {!USDValue || USDValue === "0.00" || USDValue == "0" ? null : (
        <>($ {USDValue})</>
      )}
    </>
  );
  //return Math.round(fee * 10 ** 9) / 10 ** 9;
}
