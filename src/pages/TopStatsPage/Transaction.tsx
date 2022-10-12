import React, {useEffect, useState} from 'react'
import {Box, Spinner} from "grommet";
import {TopTable} from "./CommonTopTable";
import {getTopMetricsByType} from "../../api/client";
import {MetricsTopItem, MetricsTopPeriod, MetricsTopType} from "../../types";
import {OptionsSelect} from "./OptionsSelect";

export const TransactionTopStats = () => {
    const [isLoading, setLoading] = useState(false)
    const [period, setPeriod] = useState(MetricsTopPeriod.d1)
    const [oneSenders, setOneSenders] = useState<MetricsTopItem[]>([])
    const [oneReceivers, setOneReceivers] = useState<MetricsTopItem[]>([])
    const [txsSenders, setTxsSenders] = useState<MetricsTopItem[]>([])
    const [txsReceivers, setTxsReceivers] = useState<MetricsTopItem[]>([])

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const rowsOneSent = await getTopMetricsByType(MetricsTopType.topOneSender, period)
                const rowsOneReceive = await getTopMetricsByType(MetricsTopType.topOneReceiver, period)
                const rowsTxsSent = await getTopMetricsByType(MetricsTopType.topTxsCountSent, period)
                const rowsTxsReceived = await getTopMetricsByType(MetricsTopType.topTxsCountReceived, period)

                await new Promise(resolve => setTimeout(resolve, 2000))

                setOneSenders(rowsOneSent)
                setOneReceivers(rowsOneReceive)
                setTxsSenders(rowsTxsSent)
                setTxsReceivers(rowsTxsReceived)
            } catch (e) {
                console.error('Error on loading top metrics:', (e as Error).message)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [period])

    return <Box gap={'16px'}>
        <Box align={'center'} pad={'8px'} direction={'row'} gap={'24px'}>
            <OptionsSelect
                disabled={isLoading}
                activeOption={period}
                onSelect={(option) => setPeriod(option)}
            />
            <Box>
                {isLoading && <Spinner size={'small'} />}
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
