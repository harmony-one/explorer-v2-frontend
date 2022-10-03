import React, {useEffect, useState} from 'react'
import {getMetricsByType} from "../../api/client";
import {MetricsDailyItem, MetricsType} from "../../types";
import {
    enrichResponse,
} from './utils'
import {DailyChartPage} from "./DailyChartPage";

export const ActiveAddresses = () => {
    const [items, setItems] = useState<MetricsDailyItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState('')

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const data = await getMetricsByType(MetricsType.walletsCount, 0, 2000)
                setItems(enrichResponse(data))
            } catch (e) {
                console.error('Error on loading metrics:', e)
                setLoadingError('Loading error')
            } finally {
                setIsLoading(false);
            }
        }
        loadData()
    }, [])

    const dailyPageProps = {
        title: 'Harmony Daily Active Addresses',
        description: 'The Active Address chart shows the daily number of unique addresses that were active on the network as a sender or receiver',
        unitLabel: 'addresses',
        items,
        isLoading,
        loadingError,
        chart: {
            yAxisLabel: 'Active Harmony Addresses',
            tooltipLabel: 'Active Harmony Addresses'
        },
        renderMaxValue: (value: string, date: string) => {
            return `Highest number of ${value} addresses on ${date}`
        },
        renderMinValue: (value: string, date: string) => {
            return `Lowest number of ${value} addresses on ${date}`
        }
    }

    return <DailyChartPage {...dailyPageProps} />
}
