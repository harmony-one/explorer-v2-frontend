import React, { useEffect, useState } from "react";
import { Box, Text, DataChart, Spinner, Tip } from "grommet";
import { BasePage, TipContent } from "src/components/ui";
import { formatNumber } from "src/components/ui/utils";
import { LatencyIcon } from "src/components/ui/icons";
import dayjs from "dayjs";
import { Transaction, LineChart, Cubes } from "grommet-icons";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { breakpoints } from "src/responsive/breakpoints";
import { useONEExchangeRate } from "../../hooks/useONEExchangeRate";
import { getTransactionCountLast14Days, getWalletsCountLast14Days } from "src/api/client";
import { Bar } from 'react-chartjs-2';

import { getCount } from "src/api/client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgb(0,0,0)'
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        autoSkip: true,
        maxRotation: 0,
        minRotation: 0
      },
    },
    y: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        autoSkip: true
      }
    }
  }
};

export const Metrics = (params: {
  latency: number;
  latencyPerBlock: number[];
}) => {
  const isLessLaptop = useMediaQuery({ maxDeviceWidth: "852px" });
  const isLessTablet = useMediaQuery({ maxDeviceWidth: breakpoints.tablet });
  const isLessMobileM = useMediaQuery({ maxDeviceWidth: "468px" });

  return (
    <BasePage
      direction="row"
      justify="between"
      wrap={isLessLaptop}
      margin={{ bottom: "medium" }}
    >
      <Box
        justify="between"
        pad={{ right: isLessMobileM ? "0" : "medium" }}
        border={{
          size: isLessMobileM ? "0" : "xsmall",
          side: "right",
          color: "border",
        }}
        style={{
          height: isLessMobileM ? "auto" : "140px",
          flex: isLessLaptop ? "1 1 40%" : "1 1 100%",
        }}
        gap={isLessMobileM ? "small" : "0"}
      >
        <ONEPrice />
        {!isLessMobileM && <Line horizontal />}
        <TransactionsCount />
      </Box>
      <Box
        justify="between"
        pad={{ left: "medium", right: isLessLaptop ? "0" : "medium" }}
        border={{
          size: isLessLaptop ? "0" : "xsmall",
          side: "right",
          color: "border",
        }}
        style={{
          height: isLessMobileM ? "auto" : "140px",
          flex: isLessLaptop ? "1 1 50%" : "1 1 100%",
        }}
      >
        <ShardCount />
        {!isLessMobileM && <Line horizontal />}
        <BlockLatency
          latency={params.latency}
          latencyPerBlock={params.latencyPerBlock}
        />
      </Box>
      {isLessLaptop && (
        <Line
          horizontal
          style={{ marginTop: isLessTablet ? "16px" : "24px" }}
        />
      )}
      <Box
        justify="between"
        pad={{
          left: isLessLaptop ? "0" : "medium",
        }}
        margin={{ top: isLessLaptop ? "medium" : "0" }}
        style={{ height: "140px", flex: "1 1 100%" }}
      >
        <BlockTransactionsHistory />
      </Box>

      {isLessLaptop && (
        <Line
          horizontal
          style={{ marginTop: isLessTablet ? "16px" : "24px" }}
        />
      )}

      <Box
        justify="between"
        pad={{
          left: isLessLaptop ? "0" : "medium",
        }}
        margin={{ top: isLessLaptop ? "medium" : "0" }}
        style={{ height: "140px", flex: "1 1 100%" }}
      >
        <WalletsHistory />
      </Box>

    </BasePage>
  );
};

function ONEPrice() {
  const { lastPrice = 0, priceChangePercent = 0 } = useONEExchangeRate();

  return (
    <Box direction="row" align="stretch">
      <Box
        pad={{ left: "xsmall", right: "small" }}
        justify="center"
        align="center"
      >
        <LineChart size="32px" color="brand" />
      </Box>
      <Box align="start">
        <Text size="small" color="minorText">
          {"ONE PRICE"}
        </Text>
        <Box direction="row" gap="xsmall" align="baseline">
          <Text size="small" weight="bold">
            $ {(+lastPrice).toFixed(4)}
          </Text>
          <Text
            size="11px"
            weight="bold"
            color={priceChangePercent > 0 ? "status-ok" : "#d23540"}
          >
            ({priceChangePercent > 0 ? "+" : ""}
            {formatNumber(priceChangePercent)}%)
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function TransactionsCount() {
  const [count, setCount] = useState<string>("");

  const availableShards = (process.env.REACT_APP_AVAILABLE_SHARDS as string)
    .split(",")
    .map((t) => +t);

  useEffect(() => {
    let tId = 0;
    const getRes = async () => {
      try {
        let res = await Promise.all(
          availableShards.map((shardNumber) =>
            getCount([shardNumber, "transactions"])
          )
        );
        setCount(
          res
            .reduce((prev, cur) => {
              prev = prev + +cur.count;
              return prev;
            }, 0)
            .toString()
        );
      } catch (err) {
        console.log(err);
      }
    };
    getRes();
    tId = window.setInterval(getRes, 30000);

    return () => {
      clearTimeout(tId);
    };
  }, []);

  return (
    <Box direction="row" align="stretch">
      <Box
        pad={{ left: "xsmall", right: "small" }}
        justify="center"
        align="center"
      >
        <Transaction size="32px" color="brand" />
      </Box>
      <Box align="start">
        <Text size="small" color="minorText">
          {"TRANSACTION VOLUME"}
        </Text>
        <Text size="small" weight="bold">
          {formatNumber(+count)}
        </Text>
      </Box>
    </Box>
  );
}

function ShardCount() {
  const count = process.env.REACT_APP_AVAILABLE_SHARDS?.split(",").length || 0;

  return (
    <Box direction="row" align="stretch">
      <Box
        pad={{ left: "xsmall", right: "small" }}
        justify="center"
        align="center"
      >
        <Cubes size="32px" color="brand" />
      </Box>
      <Box align="start">
        <Text size="small" color="minorText">
          {"SHARD COUNT"}
        </Text>
        <Text size="small" weight="bold">
          {formatNumber(count)}
        </Text>
      </Box>
    </Box>
  );
}

function BlockLatency(params: { latency: number; latencyPerBlock: number[] }) {
  return (
    <Box direction="row" align="stretch">
      <Box
        pad={{ left: "xsmall", right: "small" }}
        justify="center"
        align="center"
      >
        <LatencyIcon size="30px" color="brand" />
      </Box>
      <Box align="start">
        <Text size="small" color="minorText">
          {"BLOCK LATENCY"}
        </Text>
        <Tip
          // dropProps={{ align: { left: "right" }, margin: { left: "small" } }}
          content={
            <TipContent
              message={
                <Box direction={"row"}>
                  {params.latencyPerBlock.map((item, index) => (
                    <Box
                      key={`${index}`}
                      direction={"column"}
                      align={"start"}
                      justify={"center"}
                      margin={"small"}
                    >
                      <Text size={"small"}>Shard {index}</Text>
                      <Text size="small" weight="bold">
                        {item.toFixed(2)}s
                      </Text>
                    </Box>
                  ))}
                </Box>
              }
            />
          }
          plain
        >
          <Text size="small" weight="bold">
            {params.latency.toFixed(2)}s
          </Text>
        </Tip>
      </Box>
    </Box>
  );
}

interface TxHitoryItem {
  timestamp: string;
  count: string;
}

function BlockTransactionsHistory() {
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

  const data = {
    labels: result.map((i) => dayjs(i.timestamp).format("DD-MM")),
    datasets: [{
      label: "Transactions",
      data: result.map((i) => +i.count),
      backgroundColor: 'rgba(0, 174, 233, 0.5)'
    }]
  }

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
          <Bar options={options} data={data} height="110px" />
        )}
      </Box>
    </Box>
  );
}


interface WalletHitoryItem {
  date: string;
  count: string;
}

function WalletsHistory() {
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
    labels: result.map((i) => dayjs(i.date).format("DD-MM")),
    datasets: [{
      label: "Wallets",
      data: result.map((i) => +i.count),
      backgroundColor: 'rgba(0, 174, 233, 0.5)'
    }]
  }

  let min = Number.MAX_SAFE_INTEGER;
  result.forEach(e=>{
    if (min > +e.count) {
      min = +e.count;
    }
  });

  const walletsChartOptions = {
    ...options,
    scales: {
      ...options.scales,
      y: {
        ...options.scales.y,
        // Example - need to calculate min value from dataset.
        // Can be calculated with round to closest number divided by 100000 without remainder.
        // For example, dataset: [525145, 589123, 603723]. Min value = 525145
        // Closest rounded min = 500000
        min: Math.floor(min/100000) * 100000
      }
    }
  } 
  
  return (
    <Box>
      <Text size="small" color="minorText" style={{ flex: "1 0 auto" }}>
        {"WALLETS"}
      </Text>
      <Box style={{ flex: "1 1 100%", marginTop: "10px" }}>
        {isLoading && (
          <Box justify="center" align="center" height="110px">
            <Spinner />
          </Box>
        )}
        {!isLoading && (
          <Bar options={walletsChartOptions} data={data} height="110px" />
        )}
      </Box>
    </Box>
  );
}

const Line = styled.div<{ horizontal?: boolean; vertical?: boolean }>`
  display: flex;
  width: ${(props) => (props.horizontal ? "100%" : "1px")};
  height: ${(props) => (props.vertical && !props.horizontal ? "100%" : "1px")};
  background-color: ${(props) => props.theme.global.colors.border};
`;
