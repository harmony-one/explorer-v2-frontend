import {useONEExchangeRate} from "../../hooks/useONEExchangeRate";
import {Box, Text} from "grommet";
import {LineChart} from "grommet-icons";
import {formatNumber} from "../ui";
import React from "react";

export default function ONEPrice() {
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