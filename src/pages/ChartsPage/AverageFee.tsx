import React, {useEffect, useState} from 'react'
import {Box, Heading} from "grommet";
import {BaseContainer, BasePage} from "../../components/ui";
import {getMetricsByType} from "../../api/client";
import dayjs from "dayjs";
import {palette} from "../../theme";
import {useThemeMode} from "../../hooks/themeSwitcherHook";
import {Line as LineChartJs} from "react-chartjs-2";
import {MetricsDailyItem, MetricsType} from "../../types";
import { getDetailedChartOptions, getChartData } from './utils'

export const ActiveAddresses = () => {
    const themeMode = useThemeMode();
    const [txs, setTxs] = useState<any[]>([]);
    const [wallets, setWallets] = useState<any[]>([]);
    const [fee, setFee] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const enrichResponse = (items: MetricsDailyItem[]) => {
        return items.reverse().map(item => ({
            ...item,
            timestamp: item.date
        }))
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const txsResults = await getMetricsByType(MetricsType.transactionsCount, 0, 1000)
                const walletsResults = await getMetricsByType(MetricsType.walletsCount, 0, 1000)
                const feeResults = await getMetricsByType(MetricsType.averageFee, 0, 1000)
                console.log('feeResults', feeResults)
                setTxs(enrichResponse(txsResults));
                setWallets(enrichResponse(walletsResults));
                setFee(enrichResponse(feeResults));
                setIsLoading(false);
            } catch (e) {
                console.error('Error on loading metrics:', e)
            }
        }
        loadData()
    }, [])

    // let min = Number.MAX_SAFE_INTEGER;
    // txs.forEach(e => {
    //     if (min > +e.value) {
    //         min = +e.value;
    //     }
    // });

    return <BaseContainer pad={{ horizontal: "0" }}>
        <Heading size="small" margin={{ bottom: "medium", top: "16px" }}>
            <Box direction={"row"}>Daily Average Fee</Box>
        </Heading>
        <BasePage pad={"small"} style={{overflow: 'inherit'}}>
            <Box style={{ width: "100%" }} direction={"row"} align={'center'}>
                {!isLoading && (
                    // @ts-ignore
                    <LineChartJs options={getDetailedChartOptions(themeMode, fee)} data={getChartData(themeMode, fee, 'Average fee')} height="50px" />
                )}
            </Box>
        </BasePage>
    </BaseContainer>
}
