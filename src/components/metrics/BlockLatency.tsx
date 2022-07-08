import {Box, Text, Tip} from "grommet";
import {LatencyIcon} from "../ui/icons";
import {TipContent} from "../ui";
import React from "react";

export default function BlockLatency(params: { latency: number; latencyPerBlock: number[] }) {
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
                >
                    <Text size="small" weight="bold">
                        {params.latency.toFixed(2)}s
                    </Text>
                </Tip>
            </Box>
        </Box>
    );
}