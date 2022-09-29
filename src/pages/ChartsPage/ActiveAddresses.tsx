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
                const limit = 1000
                let data: MetricsDailyItem[] = []
                for(let i = 0; i < 2; i++) {
                    const res = await getMetricsByType(MetricsType.walletsCount, i * limit, limit)
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
        title: 'Harmony Daily Active Addresses',
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
