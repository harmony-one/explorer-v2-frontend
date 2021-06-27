import React from "react";
import { Text } from "grommet";
import { useONEExchangeRate } from "src/hooks/useONEExchangeRate";

export const FiatPrice = () => {
  const { lastPrice, priceChangePercent } = useONEExchangeRate();

  if (!lastPrice) {
    return <Text size="xsmall">&nbsp;</Text>;
  }

  const price = parseFloat(lastPrice).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: "USD",
  });
  const change = (+priceChangePercent).toFixed(2);
  const isPositive = +priceChangePercent >= 0;

  return (
    <>
      <Text size="xsmall">ONE:&nbsp;${price}&nbsp;</Text>
      <Text size="xsmall" color={isPositive ? "#69FABD" : "status-error"}>
        ({isPositive && "+"}
        {change}%)
      </Text>
    </>
  );
};
