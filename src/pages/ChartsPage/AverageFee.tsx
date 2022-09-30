import React, {useEffect, useState} from 'react'
import {getMetricsByType} from "../../api/client";
import {MetricsDailyItem, MetricsType} from "../../types";
import {
    enrichResponse,
} from './utils'
import {DailyChartPage} from "./DailyChartPage";

export const AverageFee = () => {
    const [items, setItems] = useState<MetricsDailyItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState('')

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const data = await getMetricsByType(MetricsType.averageFee, 0, 2000)
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
        title: 'Harmony Daily Average Fee',
        unitLabel: 'fee',
        items,
        isLoading,
        loadingError,
        chart: {
            yAxisLabel: 'Average Transaction Fee (ONE)',
            tooltipLabel: 'Average tx fee (ONE)'
        },
        renderMaxValue: (value: string, date: string) => {
            return `Highest average transaction fee of ${value} ONE on ${date}`
        },
        renderMinValue: (value: string, date: string) => {
            return `Lowest average transaction fee of ${value} ONE on ${date}`
        }
    }

    return <DailyChartPage {...dailyPageProps} />
}
