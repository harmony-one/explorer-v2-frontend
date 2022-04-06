import React, { useState } from "react";
import { StatusCritical } from "grommet-icons";
import { Address, BaseContainer, BasePage, Button } from "src/components/ui";
import { Heading, DateInput, Box, Spinner, Tip, Text } from "grommet";
import styled from "styled-components";
import useQuery from "../../hooks/useQuery";
import { getRelatedTransactionsByType } from "../../api/client";
import { downloadCSV } from "./export-utils";
import dayjs from "dayjs";
import { toaster } from "../../App";

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
  const type = query.get('type') || '';

  const dateFormat = 'YYYY-MM-DD'
  const initialDateFrom = dayjs().startOf('month').format(dateFormat)
  const initialDateTo = dayjs().format(dateFormat)

  const [isDownloading, setIsDownloading] = useState(false)
  const [dateFrom, setDateFrom] = useState(initialDateFrom)
  const [dateTo, setDateTo] = useState(initialDateTo)

  const dateInputProps = {
    format: 'mm/dd/yyyy',
    value: (new Date()).toISOString(),
    calendarProps: { size: 'medium' },
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
      const data = await getRelatedTransactionsByType([
        0,
        address,
        'transaction',
        filter,
      ]);
      downloadCSV(data, `export_${address}.csv`)
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

  return <BaseContainer pad={{ horizontal: "0" }} style={{ maxWidth: '700px', alignSelf: 'center' }}>
    <Heading size="xsmall" margin={{ bottom: "medium", top: "0" }}>
      Export transactions
    </Heading>
    <BasePage pad={"medium"} style={{ overflow: "inherit" }}>
      <Box pad={{ top: 'medium', bottom: 'medium' }} style={{ display: 'inline-block' }}>
        Export the last {filter.limit} transactions for <Address address={address} /> starting from
      </Box>
      <FlexWrapper>
        <InputContainer>
          <Tip content={<span>Select start date</span>}>
          <DateInput
            {...dateInputProps}
            value={dayjs(dateFrom).toISOString()}
            onChange={({ value }) => onChangeDateFrom(value)}
          />
          </Tip>
        </InputContainer>
        <div>to</div>
        <InputContainer>
          <Tip content={<span>Select end date</span>}>
            <DateInput
              {...dateInputProps}
              value={dayjs(dateTo).toISOString()}
              onChange={({ value }) => onChangeDateTo(value)}
            />
          </Tip>
        </InputContainer>
      </FlexWrapper>
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
