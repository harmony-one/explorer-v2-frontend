import React, {useEffect, useState} from 'react'
import {getMetricsByType} from "../../api/client";
import {MetricsDailyItem, MetricsType} from "../../types";
import {
    enrichResponse,
} from './utils'
import {DailyChartPage} from "./DailyChartPage";

export const DailyTransactions = () => {
    const [items, setItems] = useState<MetricsDailyItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState('')

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const data = await getMetricsByType(MetricsType.transactionsCount, 0, 2000)
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
        title: 'Harmony Daily Transactions',
        unitLabel: 'transactions',
        items,
        isLoading,
        loadingError,
        chart: {
            yAxisLabel: 'Transactions per day',
            tooltipLabel: 'Daily transactions'
        },
        renderMaxValue: (value: string, date: string) => {
            return `Highest number of ${value} transactions on ${date}`
        },
        renderMinValue: (value: string, date: string) => {
            return `Lowest number of ${value} transactions on ${date}`
        }
    }

    return <DailyChartPage {...dailyPageProps} />
}
