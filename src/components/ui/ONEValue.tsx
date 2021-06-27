import { useONEExchangeRate } from "../../hooks/useONEExchangeRate";
import { getNearestPriceForTimestamp } from "src/components/ONE_USDT_Rate";
import { Text, Box, Tip } from "grommet";
import { TipContent } from "./Tooltip";
import React from "react";
import dayjs from "dayjs";
import { formatNumber } from "./utils";

interface ONEValueProps {
  value: string | number;
  timestamp?: string;
  hideTip?: boolean;
}

// @ts-ignore
export const ONEValue = (props: ONEValueProps) => {
  const { value, timestamp = "", hideTip = false } = props;
  const { lastPrice } = useONEExchangeRate();

  if (!value) {
    return null;
  }

  const isTodayTransaction =
    dayjs(timestamp).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
  const price =
    timestamp && !isTodayTransaction
      ? getNearestPriceForTimestamp(timestamp)
      : lastPrice;

  const bi = BigInt(value) / BigInt(10 ** 14);
  const v = parseInt(bi.toString()) / 10000;
  let USDValue = "";
  if (price && v > 0) {
    USDValue = (v * +price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currency: "USD",
    });
  }

  return (
    <Box direction="row" gap="xsmall">
      <Text
        weight={v > 0 ? "bold" : "normal"}
        size="small"
        margin={{ right: "xxmall" }}
      >
        {v.toString()} ONE
      </Text>
      {USDValue && +price > 0 && !isTodayTransaction && !hideTip && (
        <Tip
          dropProps={{ align: { left: "right" }, margin: { left: "small" } }}
          content={
            <TipContent
              message={
                <span>
                  {`Displaying value on ${dayjs(timestamp).format(
                    "YYYY-MM-DD"
                  )}. Current value`}{" "}
                  <b>
                    $
                    {formatNumber(v * +lastPrice, {
                      maximumFractionDigits: 2,
                    })}
                  </b>
                </span>
              }
            />
          }
          plain
        >
          <Text size="small">(${USDValue})</Text>
        </Tip>
      )}
      {USDValue && +price > 0 && isTodayTransaction && (
        <Text size="small">(${USDValue})</Text>
      )}
    </Box>
  );
};
