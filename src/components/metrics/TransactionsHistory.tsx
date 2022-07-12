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
import {palette} from "../../theme";

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
                borderColor: themeMode === 'light' ? palette.DarkGray : palette.MintGreen,
                borderWidth: 1,
                backgroundColor: 'white',
                pointRadius: 0,
                pointHoverRadius: 8,
                pointBorderWidth: 0,
                pointBorderColor: 'transparent',
                pointHoverBackgroundColor: themeMode === 'light' ? 'rgba(85, 98, 109, 0.4)' : 'rgba(105, 250, 189, 0.4)',
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