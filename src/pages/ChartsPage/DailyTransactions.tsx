import React, {useEffect, useState} from 'react'
import {Box, Heading, Spinner, Text} from "grommet";
import {BaseContainer, BasePage} from "../../components/ui";
import {getMetricsByType} from "../../api/client";
import {useThemeMode} from "../../hooks/themeSwitcherHook";
import {Line as LineChartJs} from "react-chartjs-2";
import {MetricsDailyItem, MetricsType} from "../../types";
import {getDetailedChartOptions, getChartData, enrichResponse, getLimitByFilterOption} from './utils'
import {ChartFilter, ChartOption} from "./ChartFilter";
import styled from "styled-components";
import dayjs from "dayjs";
import {Info} from "grommet-icons";

const SpinnerContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const DailyTransactions = () => {
    const themeMode = useThemeMode();
    const [txs, setTxs] = useState<any[]>([]);
    const [cache, setCache] = useState<MetricsDailyItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filterOption, setFilterOption] = useState(ChartOption.year)
    const [minValue, setMinValue] = useState<MetricsDailyItem>()
    const [maxValue, setMaxValue] = useState<MetricsDailyItem>()

    const applyFilter = (cachedData: MetricsDailyItem[]) => {
        const limit = getLimitByFilterOption(filterOption)
        const txsData = cachedData.slice(-limit)
        const sortedTxs = [...txsData].sort((a, b) => +a.value - +b.value)
        setTxs(cachedData.slice(-limit))
        setMinValue(sortedTxs[0])
        setMaxValue(sortedTxs[sortedTxs.length - 1])
    }

    useEffect(() => {
        if(cache.length > 0) {
            applyFilter(cache)
        }
    }, [filterOption])

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const data = await getMetricsByType(MetricsType.transactionsCount, 0, 1000)
                const cachedData = enrichResponse(data)
                setCache(cachedData)
                applyFilter(cachedData)

            } catch (e) {
                console.error('Error on loading metrics:', e)
            } finally {
                setIsLoading(false);
            }
        }
        loadData()
    }, [])

    const chartOptions = getDetailedChartOptions(themeMode, txs, { yAxisLabel: 'Transactions per day' })
    const chartData = getChartData(themeMode, txs, 'Daily transactions')

    // @ts-ignore
    return <BaseContainer pad={{ horizontal: "0" }}>
        <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
            <Box direction={"row"}>Harmony Daily Transactions Chart</Box>
        </Heading>
        <BasePage pad={"small"}>
            <Box direction={'row'} justify={'between'}>
                <Box direction={'row'} gap={'4px'} align={'center'}>
                    <Info size={'small'} />
                    <Text>Highest number of {Intl.NumberFormat('en-US').format(maxValue ? +maxValue.value : 0)} transactions
                        on {dayjs(maxValue?.date).format('dddd, MMMM D, YYYY')}</Text>
                </Box>
                <Box direction={'row'} gap={'4px'} align={'center'}>
                    <Info size={'small'} />
                    <Text>Lowest number of {Intl.NumberFormat('en-US').format(minValue ? +minValue.value : 0)} transactions
                        on {dayjs(minValue?.date).format('dddd, MMMM D, YYYY')}</Text>
                </Box>
            </Box>
        </BasePage>
        <BasePage pad={"small"} style={{overflow: 'inherit', marginTop: '16px'}}>
            <Box align={'end'}>
                <ChartFilter
                    disabled={isLoading}
                    activeOption={filterOption}
                    onSelect={(o) => setFilterOption(o)}
                />
            </Box>
            <Box
                width={'100%'}
                direction={"row"}
                align={'center'}
                justify={'center'}
            >
                {isLoading && <SpinnerContainer justify={'center'} gap={'16px'} align={'center'}>
                    <Spinner size={'medium'} />
                    <Text>Loading Data</Text>
                </SpinnerContainer>}
                <Box style={{ filter: isLoading ? 'blur(2px)': 'unset' }} height="inherit"  width={'inherit'} >
                    {
                        // @ts-ignore
                        <LineChartJs options={chartOptions} data={chartData} height="60px" />
                    }
                </Box>
            </Box>
        </BasePage>
    </BaseContainer>
}
