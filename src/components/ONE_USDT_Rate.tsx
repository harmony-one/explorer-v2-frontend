import React, { useEffect } from "react";
import dayjs from "dayjs";
export function ONE_USDT_Rate() {
  useEffect(() => {
    const getRates = () => {
      const rates = {} as Record<string, number>;
      fetch("https://api.binance.com/api/v3/klines?symbol=ONEUSDT&interval=1d")
        .then((_res) => _res.json())
        .then((res) => {
          res.forEach((t: Array<string | number>) => {
            rates[String(t[0])] = Number(t[1]);
          });
          window.localStorage.setItem('ONE_USDT_rates', JSON.stringify(rates))
        });
    };
    getRates();
    const tId = window.setInterval(getRates, 10 * 60 * 1e3);

    return () => {
      clearTimeout(tId);
    }
  }, []);
  return null;
}

export function getNearestPriceForTimestamp(timestampString: string) {
  const rates = JSON.parse(window.localStorage.getItem('ONE_USDT_rates') || '{}') as Record<string, number>;
  const timestamps = Object.keys(rates);
  const prices = Object.values(rates);
  const timestamp = dayjs(timestampString).valueOf();

  if(timestamp >= +timestamps.slice(-1)[0]) {
    return prices.slice(-1)[0];
  }

  if(timestamp <= +timestamps[0]) {
    return -1;
  }

  if(timestamps.length) {
    let i = 0;
    while(+timestamps[i] <= timestamp) {
      i++;
    }

    return prices[i];
  }

  return 0;
}
