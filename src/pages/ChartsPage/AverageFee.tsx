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
                const limit = 1000
                let data: MetricsDailyItem[] = []
                for(let i = 0; i < 2; i++) {
                    const res = await getMetricsByType(MetricsType.averageFee, i * limit, limit)
                    data = [...data, ...res]

                    if(res.length < limit) {
                        break;
                    }
                }
                const cachedData = enrichResponse(data)
                setItems(cachedData)
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
