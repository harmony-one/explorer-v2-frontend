import {config} from "../../config";
import {Box, Text} from "grommet";
import {Cubes} from "grommet-icons";
import {formatNumber} from "../ui";
import React from "react";

export default function ShardCount() {
    const { availableShards } = config
    const count = availableShards.length || 0;

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