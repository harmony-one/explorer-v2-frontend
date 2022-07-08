import {useThemeMode} from "../../hooks/themeSwitcherHook";
import React, {useEffect, useState} from "react";
import {getWalletsCountLast14Days} from "../../api/client";
import dayjs from "dayjs";
import {useMediaQuery} from "react-responsive";
import {Box, Spinner, Text} from "grommet";

import {Line as LineChartJs} from "react-chartjs-2";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import {getChartOptions} from "./common";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
);

interface WalletHitoryItem {
    date: string;
    count: string;
}

export default function WalletsHistory() {
    const themeMode = useThemeMode();
    const [result, setResult] = useState<WalletHitoryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getElements = async () => {
            setIsLoading(true);
            const res = await getWalletsCountLast14Days();
            setResult(res);
            setIsLoading(false);
        };

        getElements();
    }, []);

    const data = {
        labels: result.map((i) => dayjs(i.date).format("dddd, MMMM DD")),
        datasets: [{
            label: "Active wallets",
            data: result.map((i) => +i.count),
            borderColor: 'rgb(43, 45, 66)',
            borderWidth: 1,
            backgroundColor: 'rgba(43, 45, 66, 0.5)',
            pointRadius: 0,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgba(43, 45, 66, 0.5)',
        }]
    }

    let min = Number.MAX_SAFE_INTEGER;
    result.forEach(e=>{
        if (min > +e.count) {
            min = +e.count;
        }
    });

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 960px)' })
    const items = result.map((item) => {
        return {
            ...item,
            timestamp: item.date
        }
    })

    return (
        <Box>
            <Box direction={'row'}>
                <Text size="small" color="minorText" style={{ flex: "1 0 auto" }}>
                    {"ACTIVE WALLETS"}
                </Text>
                {!isTabletOrMobile &&
                    <Box direction={'row'}>
                        By&nbsp;
                        <a href={`https://harmony-transactions.vercel.app/`} target={'_blank'}>
                            <Text color={'brand'} size={'small'}>Metrics DAO</Text>
                        </a>
                    </Box>
                }
            </Box>
            <Box style={{ flex: "1 1 100%", marginTop: "10px" }}>
                {isLoading && (
                    <Box justify="center" align="center" height="110px">
                        <Spinner />
                    </Box>
                )}
                {!isLoading && (
                // @ts-ignore
                  <LineChartJs options={getChartOptions(themeMode, items)} data={data} height="110px" />
                )}
            </Box>
        </Box>
    );
}