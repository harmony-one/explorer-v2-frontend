import React from "react";
import {Box, Heading, Text} from "grommet";
import { BasePage, BaseContainer } from "src/components/ui";
import {useHistory, useLocation} from "react-router-dom";
import {ActiveAddresses} from "./ActiveAddresses";
import {DailyTransactions} from "./DailyTransactions";
import {AverageFee} from "./AverageFee";
import {AverageBlockSize} from "./AverageBlockSize";
import styled from "styled-components";

enum ChartType {
    tx = 'tx',
    addresses = 'addresses',
    fee = 'fee',
    blockSize = 'blocksize'
}

const PreviewContainer = styled(Box)`
  flex: 0 0 calc(25% - 16px);
  margin-left: 8px;
  margin-right: 8px;

  @media (max-width: 1024px) {
    flex: 0 0 calc(50% - 16px);
    margin-bottom: 0.75rem;
  }

  @media (max-width: 768px) {
    flex: 0 0 calc(100% - 16px);
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }
`

const PreviewCard = (props: { type: ChartType, title: string }) => {
    const {type, title} = props
    const history = useHistory();

    const onClick = () => history.push(`charts/${type}`)

    return <PreviewContainer border={{ size: '1px' }} onClick={onClick} round={'8px'} overflow={'hidden'}>
        <Box pad={'8px'} background={'backgroundDropdownItem'}>
            <Text size={'small'} color={'brand'}>{title}</Text>
        </Box>
        <Box style={{ filter: 'grayscale(0.8)' }} pad={'8px'} border={{ side: 'top' }}>
            {type === ChartType.tx && <img src={require("./thumbnails/daily_txs.png").default} alt={type} />}
            {type === ChartType.addresses && <img src={require("./thumbnails/daily_addresses.png").default} alt={type} />}
            {type === ChartType.fee && <img src={require("./thumbnails/daily_fee.png").default} alt={type} />}
            {type === ChartType.blockSize && <img src={require("./thumbnails/daily_blocksize.png").default} alt={type} />}
        </Box>
    </PreviewContainer>
}

export function ChartsPage() {
    const location = useLocation();
    const [, ,route] = location.pathname.split('/')

    if(route === ChartType.tx) {
        return <DailyTransactions />
    } else if(route === ChartType.addresses) {
        return <ActiveAddresses />
    } else if(route === ChartType.fee) {
        return <AverageFee />
    } else if(route === ChartType.blockSize) {
        return <AverageBlockSize />
    }

    return (
        <BaseContainer pad={{ horizontal: "0" }}>
            <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
                <Box direction={"row"}>Harmony One Charts</Box>
            </Heading>
            <BasePage pad={'0'} style={{overflow: 'inherit'}}>
                <Box border={{ side: 'bottom' }} pad={"small"}>
                    <Text weight={'bold'}>Blockchain Data</Text>
                </Box>
                <Box wrap direction={'row'} pad={"small"} justify={'center'} align={'center'}>
                    <PreviewCard type={ChartType.tx} title={'Daily Transactions Chart'} />
                    <PreviewCard type={ChartType.addresses} title={'Daily Active Addresses'} />
                    <PreviewCard type={ChartType.fee} title={'Average Transaction Fee'} />
                    <PreviewCard type={ChartType.blockSize} title={'Average Block Size'} />
                </Box>
            </BasePage>
        </BaseContainer>
    );
}
