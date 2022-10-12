import React, {useEffect, useState} from 'react'
import {Box} from "grommet";
import {TopTable} from "./CommonTopTable";
import {getTopMetricsByType} from "../../api/client";
import {MetricsTopItem, MetricsTopType} from "../../types";

enum PeriodOption {
    d1 = 1,
    d3 = 3,
    d7 = 7
}

export const TransactionTopStats = () => {
    const [period, setPeriod] = useState(PeriodOption.d1)
    const [oneSenders, setOneSenders] = useState<MetricsTopItem[]>([])
    const [oneReceivers, setOneReceivers] = useState<MetricsTopItem[]>([])
    const [txsSenders, setTxsSenders] = useState<MetricsTopItem[]>([])
    const [txsReceivers, setTxsReceivers] = useState<MetricsTopItem[]>([])

    useEffect(() => {
        const loadData = async () => {
            const rowsOneSent = await getTopMetricsByType(MetricsTopType.topOneSender, 1)
            const rowsOneReceive = await getTopMetricsByType(MetricsTopType.topOneReceiver, 1)
            const rowsTxsSent = await getTopMetricsByType(MetricsTopType.topTxsCountSent, 1)
            const rowsTxsReceived = await getTopMetricsByType(MetricsTopType.topTxsCountReceived, 1)

            setOneSenders(rowsOneSent)
            setOneReceivers(rowsOneReceive)
            setTxsSenders(rowsTxsSent)
            setTxsReceivers(rowsTxsReceived)
        }
        loadData()
    }, [])

    return <Box
        wrap
        direction={'row'}
        pad={"small"}
        justify={'center'}
        align={'center'}
    >
        <TopTable
            items={oneSenders}
            title={'Top ONE Senders'}
            columns={['Rank', 'Address', 'Total ONE', 'Share']}
        />
        <TopTable
            items={oneReceivers}
            title={'Top ONE Receivers'}
            columns={['Rank', 'Address', 'Total ONE', 'Share']}
        />
        <TopTable
            items={txsSenders}
            title={'Top Txs Count Sent'}
            columns={['Rank', 'Address', 'Total Txs', 'Share']}
        />
        <TopTable
            items={txsReceivers}
            title={'Top Txs Count Received'}
            columns={['Rank', 'Address', 'Total Txs', 'Share']}
        />
    </Box>
}
