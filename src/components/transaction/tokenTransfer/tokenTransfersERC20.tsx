import {Log} from "../../../types"
import {parseSuggestedEvent} from "../../../web3/parseByteCode"
import {Box, Text} from "grommet"
import {Address} from "../../ui"
import {TokenValueBalanced} from "../../ui/TokenValueBalanced"
import React from "react"

const erc20TransferTopic =
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
export const tokenTransfersERC20 = (logs: Log[]) => {
    const erc20Logs = logs.filter((l) => l.topics.includes(erc20TransferTopic));
    const events = erc20Logs
        .map((l) =>
            parseSuggestedEvent("Transfer(address,address,uint256)", l.data, l.topics)
        )
        .filter((e) => e && e.parsed);

    if (!events.length) {
        return <></>;
    }

    return (
        <>
            {events.map((e: any, index) => {
                const val = e.parsed["$2"];
                const address = erc20Logs[index].address;

                return (
                    <Box
                        direction={"column"}
                        align={"start"}
                        pad={"xxsmall"}
                        style={{ borderRadius: "6px", marginBottom: "3px" }}
                    >
                        <Box direction={"row"}>
                            <Text size="small" color="minorText">
                                From :&nbsp;
                            </Text>
                            <Address address={e.parsed["$0"].toLowerCase()} />
                            &nbsp;
                            <Text size="small" color="minorText">
                                To :&nbsp;
                            </Text>
                            <Address address={e.parsed["$1"].toLowerCase()} />
                        </Box>
                        <Box align={"center"} direction={"row"}>
                            <Text size="small" color="minorText">
                                Value : &nbsp;
                            </Text>
                            <TokenValueBalanced
                                value={val}
                                tokenAddress={address}
                                direction={"row"}
                            />
                        </Box>
                    </Box>
                );
            })}
        </>
    );
};