import React, {useEffect, useState} from 'react'
import useAPIPolling, { APIPollingOptions } from './polling'
import { singletonHook } from 'react-singleton-hook';

const url = 'https://api.binance.com/api/v1/ticker/24hr?symbol=ONEUSDT'
const fetchFunc = () => fetch(url).then(r => r.json())

export const useONEExchangeRate = singletonHook({}, () => {
  const [data, setData] = useState<any>({})

  const options: APIPollingOptions<any> = {
    fetchFunc,
    initialState: {},
    delay: 30000
  }
  const res = useAPIPolling(options)

  useEffect(() => {
    setData(res)
  }, [res])

  return data
})