import React, {useEffect, useState} from 'react'
import {Box, Heading, Spinner, Text} from "grommet";
import {BaseContainer, BasePage} from "../../components/ui";
import {getMetricsByType} from "../../api/client";
import {useThemeMode} from "../../hooks/themeSwitcherHook";
import {Line as LineChartJs} from "react-chartjs-2";
import {MetricsDailyItem, MetricsType} from "../../types";
import {
    getDetailedChartOptions,
    getChartData,
    enrichResponse,
    getLimitByFilterOption,
    downloadMetricsCSV
} from './utils'
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
    const [items, setItems] = useState<MetricsDailyItem[]>([]);
    const [cache, setCache] = useState<MetricsDailyItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filterOption, setFilterOption] = useState(ChartOption.year)
    const [minValue, setMinValue] = useState<MetricsDailyItem>()
    const [maxValue, setMaxValue] = useState<MetricsDailyItem>()

    const applyFilter = (cachedData: MetricsDailyItem[]) => {
        const limit = getLimitByFilterOption(filterOption)
        const data = cachedData.slice(-limit)
        const sortedData = [...data].sort((a, b) => +a.value - +b.value)
        setItems(cachedData.slice(-limit))
        setMinValue(sortedData[0])
        setMaxValue(sortedData[sortedData.length - 1])
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
                const limit = 1000
                let data: MetricsDailyItem[] = []
                for(let i = 0; i < 2; i++) {
                    const res = await getMetricsByType(MetricsType.transactionsCount, i * limit, limit)
                    data = [...data, ...res]

                    if(res.length < limit) {
                        break;
                    }
                }
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

    const chartOptions = getDetailedChartOptions(themeMode, items, { yAxisLabel: 'Transactions per day' })
    const chartData = getChartData(themeMode, items, 'Daily transactions')

    // @ts-ignore
    return <BaseContainer pad={{ horizontal: "0" }}>
        <Heading size="20px" margin={{ bottom: "medium", top: "0" }}>
            <Box direction={"row"}>Harmony Daily Transactions Chart</Box>
        </Heading>
        <BasePage pad={"small"}>
            <Box direction={'row'} justify={'between'} flex={'grow'} wrap={true}>
                <Box direction={'row'} gap={'8px'} justify={'center'} align={'center'} style={{ flexGrow: 2 }}>
                    <Info size={'small'} />
                    <Text size={'small'}>Highest number of {Intl.NumberFormat('en-US').format(maxValue ? +maxValue.value : 0)} transactions
                        on {dayjs(maxValue?.date).format('dddd, MMMM D, YYYY')}</Text>
                </Box>
                <Box direction={'row'} gap={'8px'} justify={'center'} align={'center'} style={{ flexGrow: 2 }}>
                    <Info size={'small'} />
                    <Text size={'small'}>Lowest number of {Intl.NumberFormat('en-US').format(minValue ? +minValue.value : 0)} transactions
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
                height="260px"
                direction={"row"}
                align={'center'}
                justify={'center'}
                margin={{ top: '8px' }}
                style={{ position: 'relative' }}
            >
                {isLoading && <SpinnerContainer justify={'center'} gap={'16px'} align={'center'}>
                    <Spinner size={'medium'} />
                    <Text>Loading Data</Text>
                </SpinnerContainer>}
                <Box height={'inherit'} width={'inherit'} style={{ filter: isLoading ? 'blur(4px)': 'unset' }} >
                    {
                        // @ts-ignore
                        <LineChartJs options={chartOptions} data={chartData} />
                    }
                </Box>
            </Box>
            <Box margin={{ top: '32px' }} align={'end'}>
                <Box direction={'row'} gap={'4px'}>
                    <Text>Download</Text>
                    <Text color={'brand'} style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => downloadMetricsCSV('transactions_history.csv', { items: cache.reverse() })}>
                        CSV Data
                    </Text>
                </Box>
            </Box>
        </BasePage>
    </BaseContainer>
}
