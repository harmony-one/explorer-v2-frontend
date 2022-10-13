import React, {useEffect, useState} from 'react'
import {Box, Spinner} from "grommet";
import {TopTable} from "./CommonTopTable";
import {getTopMetricsByType} from "../../api/client";
import {MetricsTopItem, MetricsTopPeriod, MetricsTopType} from "../../types";
import {OptionsSelect} from "./OptionsSelect";
import dayjs from "dayjs";

const defaultMetricsItem = {
    [MetricsTopType.topOneSender]: [] as MetricsTopItem[],
    [MetricsTopType.topOneReceiver]: [] as MetricsTopItem[],
    [MetricsTopType.topTxsCountSent]: [] as MetricsTopItem[],
    [MetricsTopType.topTxsCountReceived]: [] as MetricsTopItem[],
}
const defaultCache = {
    [MetricsTopPeriod.d1]: {...defaultMetricsItem},
    [MetricsTopPeriod.d3]: {...defaultMetricsItem},
    [MetricsTopPeriod.d7]: {...defaultMetricsItem},
}

export const TransactionTopStats = () => {
    const [isLoading, setLoading] = useState(false)
    const [period, setPeriod] = useState(MetricsTopPeriod.d1)
    const [cache, setCache] = useState(defaultCache)
    const [oneSenders, setOneSenders] = useState<MetricsTopItem[]>([])
    const [oneReceivers, setOneReceivers] = useState<MetricsTopItem[]>([])
    const [txsSenders, setTxsSenders] = useState<MetricsTopItem[]>([])
    const [txsReceivers, setTxsReceivers] = useState<MetricsTopItem[]>([])

    useEffect(() => {
        const retrieveMetrics = async (type: MetricsTopType, p: MetricsTopPeriod) => {
            const cachedRows = cache[p][type]
            if(cachedRows.length > 0) {
                return [...cachedRows]
            }
            // await new Promise(resolve => setTimeout(resolve, 500))

            return await getTopMetricsByType(type, p)
        }

        const loadData = async () => {
            try {
                setLoading(true)
                const rowsOneSent = await retrieveMetrics(MetricsTopType.topOneSender, period)
                const rowsOneReceive = await retrieveMetrics(MetricsTopType.topOneReceiver, period)
                const rowsTxsSent = await retrieveMetrics(MetricsTopType.topTxsCountSent, period)
                const rowsTxsReceived = await retrieveMetrics(MetricsTopType.topTxsCountReceived, period)

                setOneSenders(rowsOneSent)
                setOneReceivers(rowsOneReceive)
                setTxsSenders(rowsTxsSent)
                setTxsReceivers(rowsTxsReceived)

                const cacheUpdated = {
                    ...cache,
                    [period]: {
                        [MetricsTopType.topOneSender]: rowsOneSent,
                        [MetricsTopType.topOneReceiver]: rowsOneReceive,
                        [MetricsTopType.topTxsCountSent]: rowsTxsSent,
                        [MetricsTopType.topTxsCountReceived]: rowsTxsReceived
                    }
                }
                setCache(cacheUpdated)
            } catch (e) {
                console.error('Error on loading top metrics:', (e as Error).message)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [period])

    const dateFrom = oneSenders.length > 0 ? dayjs(oneSenders[0].updatedAt).subtract(period, 'day') : ''
    const dateTo = oneSenders.length > 0 ? dayjs(oneSenders[0].updatedAt): ''

    return <Box gap={'16px'}>
        <Box direction={'row'} align={'center'} pad={'8px'} justify={'between'}>
            <Box direction={'row'} gap={'24px'} justify={'center'}>
                <OptionsSelect
                    disabled={isLoading}
                    activeOption={period}
                    onSelect={(option) => setPeriod(option)}
                />
                <Box justify={'center'}>
                    {isLoading && <Spinner size={'small'} />}
                </Box>
            </Box>
            <Box pad={'8px'}>
                {dateFrom && dateTo &&
                    `${dateFrom.format('DD MMM')} - ${dateTo.format('DD MMM')}`
                }
            </Box>
        </Box>
        <Box
            wrap
            direction={'row'}
            justify={'center'}
            align={'center'}
        >
            <TopTable
                items={oneSenders}
                title={'Top ONE Senders'}
                columns={['Rank', 'Address', 'Total ONE', 'Share']}
                isLoading={isLoading}
            />
            <TopTable
                items={oneReceivers}
                title={'Top ONE Receivers'}
                columns={['Rank', 'Address', 'Total ONE', 'Share']}
                isLoading={isLoading}
            />
            <TopTable
                items={txsSenders}
                title={'Top Txs Count Sent'}
                columns={['Rank', 'Address', 'Total Txs', 'Share']}
                isLoading={isLoading}
            />
            <TopTable
                items={txsReceivers}
                title={'Top Txs Count Received'}
                columns={['Rank', 'Address', 'Total Txs', 'Share']}
                isLoading={isLoading}
            />
        </Box>
    </Box>
}
