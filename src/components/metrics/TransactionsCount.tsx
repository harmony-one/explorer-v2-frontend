import React, {useEffect, useState} from "react";
import {config} from "../../config";
import {getCount} from "../../api/client";
import {Box, Text} from "grommet";
import {Transaction} from "grommet-icons";
import {formatNumber} from "../ui";

export default function TransactionsCount() {
    const [count, setCount] = useState<string>("");

    useEffect(() => {
        let tId = 0;
        const getRes = async () => {
            try {
                let res = await Promise.all(
                    config.availableShards.map((shardNumber) =>
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