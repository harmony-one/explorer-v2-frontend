import React, {useEffect, useState} from 'react'
import {Box, Heading, Spinner, Text} from "grommet";
import {BaseContainer, BasePage} from "../../components/ui";
import {useThemeMode} from "../../hooks/themeSwitcherHook";
import {Line as LineChartJs} from "react-chartjs-2";
import {MetricsDailyItem} from "../../types";
import {
    getDetailedChartOptions,
    getChartData,
    downloadMetricsCSV
} from './utils'
import {ChartFilter, ChartOption} from "./ChartFilter";
import styled from "styled-components";
import dayjs from "dayjs";
import {Alert, Info} from "grommet-icons";
import {Link} from "react-router-dom";
import {useMediaQuery} from "react-responsive";

const ChartModalContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const TextLink = styled(Text)`
  cursor: pointer;
  text-decoration: underline;
`

const LoadingErrorModal = () => {
    return <ChartModalContainer
        justify={'center'}
        gap={'16px'}
        pad={'16px'}
        align={'center'}
        background={'warningBackground'}
        round={'8px'}
        border={{ size: '1px' }}
        style={{ zIndex: 1 }}
    >
        <Alert size={'medium'} />
        <Text>Error on loading data</Text>
        <Text size={'small'}>Please try again later</Text>
    </ChartModalContainer>
}

const formatValue = (value: string) => Intl.NumberFormat('en-US').format(+value)
const formatDate = (date: string) => date ? dayjs(date).format('dddd, MMMM D, YYYY') : '—'

export interface DailyChartPageProps {
    title: string
    description?: string
    unitLabel: string
    items: MetricsDailyItem[]
    isLoading: boolean
    loadingError?: string
    chart: {
        yAxisLabel: string,
        tooltipLabel: string
    }
    renderMaxValue: (value: string, date: string) => string
    renderMinValue: (value: string, date: string) => string
}

const chartItemFilter = (item: MetricsDailyItem, option: ChartOption) => {
    const date = dayjs(item.date)
    const current = dayjs()
    switch(option) {
        case ChartOption.month: return current.diff(date, 'month') <= 1
        case ChartOption.month3: return current.diff(date, 'month') <= 3
        case ChartOption.year: return current.diff(date, 'month') <= 12
        case ChartOption.ytd: return current.year() === date.year()
        default:
            return true
    }
}

export const DailyChartPage = (props: DailyChartPageProps) => {
    const themeMode = useThemeMode();

    const { isLoading, loadingError } = props

    const [items, setItems] = useState<MetricsDailyItem[]>([]);
    const [cache, setCache] = useState<MetricsDailyItem[]>([])
    const [filterOption, setFilterOption] = useState(ChartOption.year)
    const [minValue, setMinValue] = useState<MetricsDailyItem>({value: '0', date: ''})
    const [maxValue, setMaxValue] = useState<MetricsDailyItem>({value: '0', date: ''})

    const applyFilter = (cachedData: MetricsDailyItem[]) => {
        const data = cachedData.filter((item) => chartItemFilter(item, filterOption))
        const sortedData = [...data].sort((a, b) => +a.value - +b.value)
        setItems(data)
        setMinValue(sortedData[0])
        setMaxValue(sortedData[sortedData.length - 1])
    }

    useEffect(() => {
        if(cache.length > 0) {
            applyFilter(cache)
        }
    }, [filterOption])

    useEffect(() => {
        setCache(props.items)
        if(props.items.length > 0) {
            applyFilter(props.items)
        }
    }, [props.items])

    const isMobile = useMediaQuery({ query: '(max-width: 868px)' })
    const chartOptions = getDetailedChartOptions(themeMode, items, { isMobile, yAxisLabel: props.chart.yAxisLabel })
    const chartData = getChartData(themeMode, items, props.chart.tooltipLabel)

    return <BaseContainer pad={{ horizontal: "0" }}>
        <Heading size="20px" margin={{ bottom: "medium", top: "0" }} style={{ maxWidth: 'unset' }}>
            <Box direction={'row'} justify={'between'} align={'center'}>
                <Box direction={"row"} gap={'8px'} align={'center'}>
                    <Box>
                        <Link to={'/charts'}><TextLink color={'brand'}>Charts</TextLink></Link>
                    </Box>
                    <Box>
                        <Text style={{ opacity: 0.4 }}>/</Text>
                    </Box>
                    <Box>
                        {props.title}
                    </Box>
                </Box>
                {!isMobile && props.description &&
                    <Box align={'end'}>
                        <Text size={'xsmall'} weight={'normal'}>{props.description}</Text>
                    </Box>
                }
            </Box>
        </Heading>
        <BasePage pad={"small"}>
            <Box direction={'row'} justify={'between'} flex={'grow'} wrap={true}>
                <Box direction={'row'} gap={'8px'} justify={'center'} align={'center'} style={{ flexGrow: 2 }}>
                    <Info size={'small'} />
                    <Text size={'small'}>
                        {props.renderMaxValue(formatValue(maxValue.value), formatDate(maxValue.date))}
                    </Text>
                </Box>
                <Box direction={'row'} gap={'8px'} justify={'center'} align={'center'} style={{ flexGrow: 2 }}>
                    <Info size={'small'} />
                    <Text size={'small'}>
                        {props.renderMinValue(formatValue(minValue.value), formatDate(minValue.date))}
                    </Text>
                </Box>
            </Box>
        </BasePage>
        <BasePage pad={"small"} style={{overflow: 'inherit', marginTop: '16px'}}>
            <Box align={'end'}>
                <ChartFilter
                    disabled={isLoading || !!loadingError}
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
                style={{ position: 'relative', pointerEvents: isLoading || loadingError ? 'none': 'unset' }}
            >
                {isLoading && <ChartModalContainer justify={'center'} gap={'16px'} align={'center'}>
                    <Spinner size={'medium'} />
                    <Text>Loading Data</Text>
                </ChartModalContainer>}
                {!isLoading && loadingError && <LoadingErrorModal />}
                <Box
                    height={'inherit'}
                    width={'inherit'}
                    style={{ filter: isLoading || loadingError ? 'blur(4px)': 'unset' }}
                >
                    {
                        // @ts-ignore
                        <LineChartJs options={chartOptions} data={chartData} />
                    }
                </Box>
            </Box>
            <Box margin={{ top: '32px' }} align={'end'}>
                <Box direction={'row'} gap={'4px'}>
                    <Text>Download</Text>
                    <TextLink
                        color={'brand'}
                        onClick={() => downloadMetricsCSV(`${props.unitLabel}_metrics.csv`, { items: [...cache].reverse() })}>
                        CSV Data
                    </TextLink>
                </Box>
            </Box>
        </BasePage>
    </BaseContainer>
}
