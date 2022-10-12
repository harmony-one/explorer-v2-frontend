import React from 'react'
import {Box, Heading, Text} from "grommet";
import {BaseContainer, BasePage} from "../../components/ui";
import {TransactionTopStats} from "./Transaction";

export const TopStatsPage = () => {
return <BaseContainer pad={{ horizontal: "0" }}>
    <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
        <Box direction={"row"}>Top Statistics</Box>
    </Heading>
    <BasePage pad={'0'} style={{overflow: 'inherit'}}>
        <Box border={{ side: 'bottom' }} pad={"small"}>
            <Text weight={'bold'}>Transactions</Text>
        </Box>
        <Box
            wrap
            direction={'row'}
            pad={"small"}
            justify={'start'}
            align={'center'}
        >
            <TransactionTopStats />
        </Box>
    </BasePage>
</BaseContainer>
}
