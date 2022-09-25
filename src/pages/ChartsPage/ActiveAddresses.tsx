import React, {useEffect, useState} from 'react'
import {Box, Heading, Text} from "grommet";
import {BaseContainer, BasePage} from "../../components/ui";
import {getWalletsCountLast14Days} from "../../api/client";
import dayjs from "dayjs";
import {palette} from "../../theme";
import {useThemeMode} from "../../hooks/themeSwitcherHook";
import {Line as LineChartJs} from "react-chartjs-2";
import {getChartOptions} from "../../components/metrics/common";

export const ActiveAddresses = () => {
    const themeMode = useThemeMode();
    const [result, setResult] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const res = await getWalletsCountLast14Days(1000);
                const test = Array(1).fill(null).map(_ => res).flat(1)
                console.log('test', test)
                setResult(test);
                setIsLoading(false);
            } catch (e) {
                console.error('Error on loading metrics:', e)
            }
        }
        loadData()
    }, [])

    const data = {
        // labels: result.map((i) => dayjs(i.date).format("dddd, MMMM DD YYYY")),
        labels: result.map((i, index) => dayjs(i.date).format("dddd, MMMM DD YYYY") + "_index_" + index),
        datasets: [{
            label: "Active wallets",
            data: result.map((i) => +i.count),
            borderColor: themeMode === 'light' ? palette.DarkGray : palette.MintGreen,
            borderWidth: 1,
            backgroundColor: 'white',
            pointRadius: 0,
            pointHoverRadius: 8,
            pointBorderWidth: 0,
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: themeMode === 'light' ? 'rgba(85, 98, 109, 0.4)' : 'rgba(105, 250, 189, 0.4)',
        }]
    }

    let min = Number.MAX_SAFE_INTEGER;
    result.forEach(e=>{
        if (min > +e.count) {
            min = +e.count;
        }
    });
    const items = result.map((item) => {
        return {
            ...item,
            timestamp: item.date
        }
    })

    return <BaseContainer pad={{ horizontal: "0" }}>
        <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
            <Box direction={"row"}>Active addresses</Box>
        </Heading>
        <BasePage pad={"small"} style={{overflow: 'inherit'}}>
            <Box style={{ width: "100%" }} direction={"row"} align={'center'}>
                {!isLoading && (
                    // @ts-ignore
                    <LineChartJs options={getChartOptions(themeMode, items)} data={data} height="50px" />
                )}
            </Box>
        </BasePage>
    </BaseContainer>
}
