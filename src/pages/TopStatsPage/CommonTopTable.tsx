import React from 'react'
import {Box, Text} from "grommet";
import {MetricsTopItem, MetricsTopType} from "../../types";
import styled from "styled-components";
import {Address} from "../../components/ui";
import {ReactComponent as HarmonyLogo} from '../../assets/Logo.svg';


export interface TopTableProps {
    items: MetricsTopItem[]
    title: string
    columns: string[]
    isLoading?: boolean
}

interface TopTableRowProps {
    item: MetricsTopItem
}

const TableContainer = styled(Box)`
  flex: 0 0 calc(50% - 16px);
  margin-left: 8px;
  margin-right: 8px;

  @media (max-width: 1024px) {
    flex: 0 0 calc(100% - 16px);
    margin-bottom: 0.75rem;
  }
`

const LogoWrapper = styled(Box)`
  svg path {
    fill: #00AEE9;
  }
`

const columnsWidth = ['5%', '65%', '15%', '10%']

const TopTableHeader = (props: { columns: string[] }) => {
    const { columns } = props
    return <Box
        direction={'row'}
        gap={'8px'}
        pad={'8px'}
        border={{ size: '2px', side: 'bottom' }}
        style={{ fontWeight: 'bold' }}
    >
        <Box width={columnsWidth[0]}>
            <Text size={'xsmall'}>{columns[0]}</Text>
        </Box>
        <Box width={columnsWidth[1]}>
            <Text size={'xsmall'}>{columns[1]}</Text>
        </Box>
        <Box width={columnsWidth[2]}>
            <Text size={'xsmall'}>{columns[2]}</Text>
        </Box>
        <Box width={columnsWidth[3]}>
            <Text size={'xsmall'}>{columns[3]}</Text>
        </Box>
    </Box>
}

const TopTableRow = (props: TopTableRowProps) => {
    const { item: { type, rank, address, value, share } } = props

    const isOneTransfer = [MetricsTopType.topOneSender, MetricsTopType.topOneReceiver].includes(type)
    const valueFormat = isOneTransfer
        ? Math.round(+value / Math.pow(10, 18))
        : value

    const valueFormatEn = Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 2
    }).format(+valueFormat)

    const shareFormatEn = Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 2
    }).format(+share)

    return <Box
        direction={'row'}
        gap={'8px'}
        pad={'8px'}
        border={{ size: '1px', side: 'bottom' }}
    >
        <Box width={columnsWidth[0]}>
            <Text size={'small'}>{rank}</Text>
        </Box>
        <Box width={columnsWidth[1]}>
            <Address address={address} hideCopyBtn={true} isShortEllipsis={true} style={{ fontSize: 'small' }} />
        </Box>
        <Box width={columnsWidth[2]} direction={'row'} align={'center'} gap={'6px'}>
            {isOneTransfer && <LogoWrapper>
                <HarmonyLogo width={'12px'} height={'12px'} />
            </LogoWrapper> }
            <Text size={'xsmall'}>{valueFormatEn}</Text>
        </Box>
        <Box width={columnsWidth[3]}>
            <Text size={'xsmall'}>{shareFormatEn}%</Text>
        </Box>
    </Box>
}

export const TopTable = (props: TopTableProps) => {
    return <TableContainer
        border={{ size: '1px' }}
        round={'8px'}
        // overflow={'hidden'}
        margin={{ bottom: '16px' }}
        style={{ opacity: props.isLoading ? 0.5 : 1 }}
        background={'background'}
    >
        <Box style={{ overflowX: 'auto' }}>
            <Box style={{ minWidth: '550px' }}>
                <Box pad={'8px'} border={{ size: '1px', side: 'bottom' }} background={'backgroundBackEmpty'}>
                    <Text size={'small'}>{props.title}</Text>
                </Box>
                <TopTableHeader columns={props.columns} />
                {props.items.map(item => <TopTableRow key={item.address} item={item} />)}
            </Box>
        </Box>
    </TableContainer>
}
