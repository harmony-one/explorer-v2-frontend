import {palette} from "../../theme";
import dayjs from "dayjs";
import {useThemeMode} from "../../hooks/themeSwitcherHook";
import React, {useEffect, useState} from "react";
import {getTransactionCountLast14Days} from "../../api/client";
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

interface TxHitoryItem {
    timestamp: string;
    count: string;
}

// const getChartOptions = (theme: 'light' | 'dark') => {
//     const axisTextColor = theme === 'light' ? palette.CoolGray : palette.LightGrey
//     return {
//         responsive: true,
//         animation: {
//             duration: 0
//         },
//         plugins: {
//             legend: {
//                 display: false
//             },
//             tooltip: {
//                 backgroundColor: 'rgb(0,0,0)'
//             },
//         },
//         scales: {
//             x: {
//                 grid: {
//                     display: false,
//                     drawBorder: false,
//                 },
//                 ticks: {
//                     autoSkip: true,
//                     maxRotation: 0,
//                     minRotation: 0,
//                     color: axisTextColor
//                 },
//             },
//             y: {
//                 grid: {
//                     display: false,
//                     drawBorder: false,
//                 },
//                 ticks: {
//                     autoSkip: true,
//                     color: axisTextColor
//                 }
//             }
//         }
//     };
// }

export default function BlockTransactionsHistory() {
    const themeMode = useThemeMode();
    const [result, setResult] = useState<TxHitoryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getElements = async () => {
            setIsLoading(true);
            const res = await getTransactionCountLast14Days();
            setResult(res);
            setIsLoading(false);
        };

        getElements();
    }, []);

    const dataTest = {
        labels: result.map((i) => dayjs(i.timestamp).format("dddd, MMMM DD YYYY")),
        datasets: [
            {
                label: 'Transactions',
                data: result.map((i) => +i.count),
                borderColor: 'rgb(43, 45, 66)',
                borderWidth: 1,
                backgroundColor: 'rgba(43, 45, 66, 0.5)',
                pointRadius: 0,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgba(43, 45, 66, 0.5)',
            }
        ],
    };

    return (
        <Box>
            <Text size="small" color="minorText" style={{ flex: "1 0 auto" }}>
                {"TRANSACTION HISTORY"}
            </Text>
            <Box style={{ flex: "1 1 100%", marginTop: "10px" }}>
                {isLoading && (
                    <Box justify="center" align="center" height="110px">
                        <Spinner />
                    </Box>
                )}
                {!isLoading && (
                    // @ts-ignore
                    <LineChartJs options={getChartOptions(themeMode, result)} data={dataTest} height="110px" />
                )}
            </Box>
        </Box>
    );
}