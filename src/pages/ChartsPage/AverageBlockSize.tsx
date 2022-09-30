import React, {useEffect, useState} from 'react'
import {getMetricsByType} from "../../api/client";
import {MetricsDailyItem, MetricsType} from "../../types";
import {
    enrichResponse,
} from './utils'
import {DailyChartPage} from "./DailyChartPage";

export const AverageBlockSize = () => {
    const [items, setItems] = useState<MetricsDailyItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState('')

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const data = await getMetricsByType(MetricsType.blockSize, 0, 2000)
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
        title: 'Harmony Average Block Size',
        unitLabel: 'blocksize',
        items,
        isLoading,
        loadingError,
        chart: {
            yAxisLabel: 'Block Size in Bytes',
            tooltipLabel: 'Block Size (Bytes)'
        },
        renderMaxValue: (value: string, date: string) => {
            return `Largest size of ${value} bytes on ${date}`
        },
        renderMinValue: (value: string, date: string) => {
            return `Smallest size of ${value} bytes on ${date}`
        }
    }

    return <DailyChartPage {...dailyPageProps} />
}
