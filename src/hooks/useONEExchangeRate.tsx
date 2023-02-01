import React, {useEffect, useState} from 'react'
import useAPIPolling, { APIPollingOptions } from './polling'
import { singletonHook } from 'react-singleton-hook';

// const url = 'https://api.binance.com/api/v1/ticker/24hr?symbol=ONEUSDT'
const url = 'https://api.coingecko.com/api/v3/simple/price?ids=harmony&vs_currencies=usd&include_24hr_change=true'
const coinGeckoMapper = (res: any) => {

  return {
    lastPrice: res.harmony.usd,
    priceChangePercent: res.harmony.usd_24h_change
  }
}

const fetchFunc = () => fetch(url).then(r => r.json())
.then(coinGeckoMapper)

export const useONEExchangeRate = singletonHook({}, () => {
  const [data, setData] = useState<any>({})

  const options: APIPollingOptions<any> = {
    fetchFunc,
    initialState: {},
    delay: 30000,
    disableTabListener: true
  }
  const res = useAPIPolling(options)

  useEffect(() => {
    setData(res)
  }, [res])

  return data
})
