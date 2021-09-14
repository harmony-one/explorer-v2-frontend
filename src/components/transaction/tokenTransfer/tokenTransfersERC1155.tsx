import {Log} from "../../../types"
import {parseSuggestedEvent} from "../../../web3/parseByteCode"
import {Box, Text} from "grommet"
import {Address} from "../../ui"
import {TokenValueBalanced} from "../../ui/TokenValueBalanced"
import React, {useEffect, useState} from "react"
import {AnchorLink} from "src/components/ui/AnchorLink";
import {getTokenERC1155AssetDetails} from "src/api/client";
import {ERC1155Icon} from "src/components/ui/ERC1155Icon";

const ercTransferTopic =
    "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62";
export const TokenTransfersERC1155 = (logs: Log[]) => {
    const ercLogs = logs.filter((l) => l.topics.includes(ercTransferTopic));
    const events = ercLogs
        .map((l) =>
            parseSuggestedEvent("TransferSingle(address,address,address,uint256,uint256)", l.data, l.topics)
        )
        .filter((e) => e && e.parsed);

    const [tokenDetails, setTokenDetails] = useState({})

    useEffect(() => {
        if (Object.keys(tokenDetails).length || !events.length) {
            return
        }

        const getTokenDetails = (address: string, tokenID: string) => {
            return getTokenERC1155AssetDetails(address, tokenID)
        }

        Promise.all(
            events.map((e, index) => getTokenDetails(ercLogs[index].address, e.parsed["$3"])
                .then((res) => ({[`${ercLogs[index].address}:${e.parsed["$3"]}`]: res}))
            )
        ).then(res => {
            console.log({res})
            setTokenDetails(res.reduce((a, b) => ({...a, ...b}), {}))
        })


    }, [events])

    if (!events.length) {
        return <></>;
    }

    return (
        <>
            {events.map((e: any, index) => {
                const operator = e.parsed["$0"];
                const from = e.parsed["$1"].toLowerCase();
                const to = e.parsed["$2"].toLowerCase();
                const id = e.parsed["$3"];
                const val = e.parsed["$4"];
                const address = ercLogs[index].address;

                // @ts-ignore
                const imageURL = tokenDetails[`${address}:${id}`]?.meta?.image

                return (
                    <>
                        <Box
                            direction={"column"}
                            align={"start"}
                            pad={"xxsmall"}
                            style={{borderRadius: "6px", marginBottom: "3px"}}
                        >
                            <Box direction={"row"}>
                                <Text size="small" color="minorText">
                                    From :&nbsp;
                                </Text>
                                <Address address={from}/>
                                &nbsp;
                                <Text size="small" color="minorText">
                                    To :&nbsp;
                                </Text>
                                <Address address={to}/>
                            </Box>
                            <Box align={"center"} direction={"row"}>
                                <Text size="small" color="minorText">
                                    ID : &nbsp;
                                </Text>
                                <AnchorLink to={`/inventory/erc1155/${address}/${BigInt(id)}`}>
                                    {BigInt(id).toString()}
                                </AnchorLink>
                                &nbsp;
                                Value : &nbsp;
                                <TokenValueBalanced
                                    value={val}
                                    tokenAddress={address}
                                    direction={"row"}
                                />
                                <ERC1155Icon imageUrl={imageURL}/>
                            </Box>
                        </Box>
                    </>
                );
            })}
        </>
    );
};