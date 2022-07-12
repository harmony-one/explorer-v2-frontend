import React from "react";
import { Box } from "grommet";
import { BasePage } from "src/components/ui";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { breakpoints } from "src/responsive/breakpoints";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
    LineElement
} from 'chart.js';
import { useThemeMode } from "../../hooks/themeSwitcherHook";
import BlockLatency from "./BlockLatency";
import TransactionsCount from "./TransactionsCount";
import ONEPrice from "./OnePrice";
import ShardCount from "./ShardsCount";
import BlockTransactionsHistory from "./TransactionsHistory";
import WalletsHistory from "./WalletsHistory";

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

export const Metrics = (params: {
  latency: number;
  latencyPerBlock: number[];
}) => {
  const isLessLaptop = useMediaQuery({ query: '(max-width: 852px)' });
  const isLessTablet = useMediaQuery({ query: `(max-width: ${breakpoints.tablet})` });
  const isLessMobileM = useMediaQuery({ query: '(max-width: 468px)' });

  return (
    <BasePage
      direction="row"
      justify="between"
      wrap={isLessLaptop}
      margin={{ bottom: "medium" }}
      style={{ width: '100%' }}
    >
      <Box
        direction={'row'}
        style={{ flexWrap: 'wrap', flexBasis: isLessLaptop ? '100%' : '50%'}}
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
            flex: 1
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
            flex: 1
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
      </Box>
      <Box
        direction={'row'}
        justify={'between'}
        wrap={isLessLaptop}
        pad={{ left: 'medium', top: isLessLaptop ? 'medium' : 'none' }}
        gap={'large'}
        style={{ flexWrap: 'wrap', flexBasis: isLessLaptop ? '100%' : '50%' }}
      >
        <Box style={{flex: isLessMobileM ? 'unset' : 1}}>
          <BlockTransactionsHistory />
        </Box>
        <Box style={{flex: isLessMobileM ? 'unset' : 1}}>
          <WalletsHistory />
        </Box>
      </Box>
    </BasePage>
  );
};

const Line = styled.div<{ horizontal?: boolean; vertical?: boolean }>`
  display: flex;
  width: ${(props) => (props.horizontal ? "100%" : "1px")};
  height: ${(props) => (props.vertical && !props.horizontal ? "100%" : "1px")};
  background-color: ${(props) => props.theme.global.colors.border};
`;
