import React, { useState } from "react";
import { StatusCritical } from "grommet-icons";
import { Address, BaseContainer, BasePage, Button, TipContent } from "src/components/ui";
import { Heading, DateInput, Box, Spinner, Tip, Text } from "grommet";
import styled from "styled-components";
import useQuery from "../../hooks/useQuery";
import { getRelatedTransactionsByType } from "../../api/client";
import { downloadCSV } from "./export-utils";
import dayjs from "dayjs";
import { toaster } from "../../App";
import { useONEExchangeRate } from "../../hooks/useONEExchangeRate";
import {TRelatedTransaction} from "../../api/client.interface";
import {useERC20Pool} from "../../hooks/ERC20_Pool";
import {useERC721Pool} from "../../hooks/ERC721_Pool";
import {useERC1155Pool} from "../../hooks/ERC1155_Pool";

const IconError = styled(StatusCritical)`
  margin-right: 5px;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const InputContainer = styled.div`
  width: 46%;
`

const DownloadButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 42px;
`

export const ExportData = () => {
  const query = useQuery();
  const address = query.get('address') || '';
  const type = (query.get('type') || 'transaction') as TRelatedTransaction;

  const dateFormat = 'YYYY-MM-DD'
  const initialDateFrom = dayjs().startOf('month').format(dateFormat)
  const initialDateTo = dayjs().format(dateFormat)

  const { lastPrice: onePrice } = useONEExchangeRate();
  const erc20Map = useERC20Pool();
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();

  const [isDownloading, setIsDownloading] = useState(false)
  const [dateFrom, setDateFrom] = useState(initialDateFrom)
  const [dateTo, setDateTo] = useState(initialDateTo)

  const dateInputProps = {
    format: 'mm/dd/yyyy',
    value: (new Date()).toISOString(),
    calendarProps: {
      size: 'medium',
      bounds: [dayjs().subtract(5, 'year').format(dateFormat), dayjs().format(dateFormat)]
    },
    inputProps: { width: '170px' }
  }

  const filter = {
    offset: 0,
    limit: 5000,
    orderBy: 'block_number',
    orderDirection: 'desc',
    filters: [{
      type: 'gt',
      property: 'timestamp',
      value: `'${dateFrom}'`
    }, {
      type: 'lt',
      property: 'timestamp',
      value: `'${dayjs(dateTo).add(1, 'day').format(dateFormat)}'`
    }]
  }

  const showErrorNotification = () => {
    toaster.show({
      message: () => (
        <Box direction={"row"} align={"center"} pad={"small"}>
          <IconError size={"medium"} color={"headerText"}/>
          <Text size={"small"}>Error on loading transactions</Text>
        </Box>
      )
    })
  }

  const onDownloadClicked = async () => {
    try {
      setIsDownloading(true)
      const txs = await getRelatedTransactionsByType([
        0,
        address,
        type,
        filter,
      ]);
      const downloadParams = {
        type,
        address,
        txs,
        onePrice,
        erc20Map,
        erc721Map,
        erc1155Map
      }
      downloadCSV(downloadParams, `export_${type}_${address}.csv`)
    } catch (e) {
      console.error('Error on download:', (e as Error).message)
      showErrorNotification()
    } finally {
      setIsDownloading(false)
    }
  }

  const onChangeDateFrom = (value: any) => {
    setDateFrom(dayjs(value).format(dateFormat))
  }

  const onChangeDateTo = (value: any) => {
    setDateTo(dayjs(value).format(dateFormat))
  }

  const getTxTextType = (type: TRelatedTransaction) => {
    return type === 'transaction' ? 'transactions' : type + ' transactions'
  }

  return <BaseContainer pad={{ horizontal: "0" }} style={{ maxWidth: '700px', alignSelf: 'center' }}>
    <Heading size="xsmall" margin={{ bottom: "medium", top: "0" }}>
      Export transactions
    </Heading>
    <BasePage pad={"medium"} style={{ overflow: "inherit" }}>
      <Box pad={{ top: 'medium', bottom: 'medium' }} style={{ display: 'inline-block' }}>
        Export the last {filter.limit} {getTxTextType(type)} for <Address address={address} />
        {type === 'transaction' && 'starting from'}
      </Box>
      {/* TODO: support timestamp filter on backend side */}
      {type === 'transaction' &&
          <FlexWrapper>
            <InputContainer>
              <Tip dropProps={{ align: { bottom: "top" }}} content={<TipContent showArrow={true} message={'Select start date'} />}>
                <DateInput
                    {...dateInputProps}
                    value={dayjs(dateFrom).toISOString()}
                    onChange={({ value }) => onChangeDateFrom(value)}
                />
              </Tip>
            </InputContainer>
            <div>to</div>
            <InputContainer>
              <Tip dropProps={{ align: { bottom: "top" }}} content={<TipContent showArrow={true} message={'Select end date'} />}>
                <DateInput
                    {...dateInputProps}
                    value={dayjs(dateTo).toISOString()}
                    onChange={({ value }) => onChangeDateTo(value)}
                />
              </Tip>
            </InputContainer>
          </FlexWrapper>
      }
      <Box style={{ justifyContent: 'center', alignItems: 'center' }} pad={{ top: 'large', bottom: 'medium' }}>
        <Box width={'small'}>
          <DownloadButton
            size={'medium'}
            disabled={isDownloading}
            style={{ letterSpacing: '0.3px' }}
            icon={isDownloading ? <Spinner size={'small'} /> : undefined}
            onClick={onDownloadClicked}
          >
            Download
          </DownloadButton>
        </Box>
      </Box>
    </BasePage>
  </BaseContainer>
}
