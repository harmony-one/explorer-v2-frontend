import {Box, ColumnConfig, Text, Tip, DropButton, TextInput, Button} from "grommet";
import {Close, Filter as FilterIcon} from 'grommet-icons'
import React, {useState} from "react";
import { RelatedTransaction } from "../../../../../types";
import { Address, DateTime, ONEValue, TipContent } from "../../../../../components/ui";
import { TransactionAddress, TransferDirectionMarker, TxMethod } from "./common";
import styled from "styled-components";

interface ColumnFilterProps {
  initialValue?: string
  onApply: (value: string) => void
}

const FilterDropButton = styled(DropButton)`
  border: none;
  background-color: rgba(119,131,143,.1);
  transition: background-color 0.2s;
  padding: 4px;
  border-radius: 4px;

  &:hover, &:active {
    background-color: #77838f;
    box-shadow: 0 4px 11px rgb(119 131 143 / 35%);
  }
`

const ColumnFilter = (props: ColumnFilterProps) => {
  const { initialValue = '', onApply } = props

  const [value, setValue] = useState(initialValue)
  const [isValueApplied, setValueApplied] = useState(!!initialValue)
  const [errorMsg, setErrorMsg] = useState('')

  const validateValue = (v: string) => {
    if(v.length > 0) {
      if(!v.startsWith('0x')) {
        return 'Address should start with "0x..."'
      }
      if(v.length != 42) {
        return 'Address should contains 42 characters'
      }
    }
    return ''
  }

  const applyButtonLabel = <Box direction={'row'} justify={'center'}>
    <FilterIcon size={'12px'} color={'text'} />
    <Text color={'text'} size={'12px'}>Filter</Text>
  </Box>

  const onApplyClicked = () => {
    const err = validateValue(value)
    if(err) {
      setErrorMsg(err)
    } else {
      onApply(value)
      setValueApplied(true)
      setErrorMsg('')
    }
  }
  const onClearClicked = () => {
    setValue('')
    onApply('')
    setValueApplied(false)

  }

  return <FilterDropButton
      label={<Box direction={'row'}>
        <FilterIcon size={'16px'} color={'text'} />
        {value && isValueApplied &&
            <Box direction={'row'} gap={'8px'} justify={'between'} align={'center'}>
              <Text size={'12px'} color={'text'}>{value.slice(0, 5)}...{value.slice(-3)}</Text>
              <Close size={'12px'} onClick={onClearClicked} />
            </Box>
        }
      </Box>}
      dropContent={
        <Box pad="small" background="text" style={{ borderRadius: '2px' }}>
          <TextInput
              placeholder={'Search by address e.g. 0x..'}
              value={value}
              size={'xsmall'}
              onChange={(e) => setValue(e.target.value)}
          />
          {errorMsg && <Box margin={{ top: 'xsmall' }}>
            <Text size={'xsmall'}>{errorMsg}</Text>
          </Box>}
          <Box direction={'row'} margin={{ top: 'small' }}>
            <Button primary label={applyButtonLabel} onClick={onApplyClicked} />
            <Button label={'Clear'} onClick={onClearClicked} />
          </Box>
        </Box>
      }
      dropProps={{ margin: { top: '32px' } }}
  />
}

interface ColumnFilters {
  [property: string]: {
    value: string
    onApply: (value: string) => void
  }
}

export function getColumns(
    id: string,
    columnFilters?: ColumnFilters
): ColumnConfig<any>[] {
  return [
    // {
    //   property: "type",
    //   size: "",
    //   header: (
    //     <Text
    //       color="minorText"
    //       size="small"
    //       style={{ width: "140px" }}
    //     >
    //       Type
    //     </Text>
    //   ),
    //   render: (data: RelatedTransaction) => (
    //     <Text size="small" style={{ width: "140px" }}>
    //       {relatedTxMap[data.transactionType] || data.transactionType}
    //     </Text>
    //   ),
    // },
    {
      property: "hash",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: "95px" }}
        >
          Hash
        </Text>
      ),
      render: (data: any) => (
        <Address
          address={data.transactionHash || data.hash}
          type="tx"
          isShortEllipsis={true}
          style={{ width: "170px" }}
        />
      ),
    },
    {
      property: "method",
      header: (
        <Text color="minorText" size="small">
          Method
        </Text>
      ),
      render: (data: any) => {
        let signature;

        try {
          // @ts-ignore
          signature =
            data.signatures &&
            data.signatures.map((s: any) => s.signature)[0].split("(")[0];
        } catch (err) {}

        if (!signature && data.value !== "0") {
          signature = "transfer";
        }

        if (!signature && data.input.length >= 10) {
          signature = data.input.slice(2, 10);
        }

        if (!signature) {
          return <Text size="small">{"—"}</Text>;
        }

        const tipContent = <TipContent
            showArrow={true}
            message={<Text size={'small'} textAlign={'center'}>{signature}</Text>}
        />

        return (
          <Tip
            dropProps={{ align: { bottom: "top" }}}
            content={tipContent}
          >
            <TxMethod>{signature}</TxMethod>
          </Tip>
        );
      },
    },
    // {
    //   property: "shard",
    //   header: (
    //     <Text color="minorText" size="small">
    //       Shard
    //     </Text>
    //   ),
    //   render: (data: RelatedTransaction) => (
    //     <Box direction="row" gap="3px" align="center">
    //       <Text size="small">{0}</Text>
    //       <FormNextLink
    //         size="small"
    //         color="brand"
    //         style={{ marginBottom: "2px" }}
    //       />
    //       <Text size="small">{0}</Text>
    //     </Box>
    //   ),
    // },
    {
      property: "from",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: "180px" }}
        >
          From
        </Text>
      ),
      render: (data: RelatedTransaction) => <TransactionAddress id={id} address={data.from} width={'180px'} />,
    },
    {
      property: "marker",
      header: <></>,
      render: (data: RelatedTransaction) => <TransferDirectionMarker id={id} data={data} />,
    },
    {
      property: "to",
      header: (
        <Box direction={'row'} justify={'start'} gap={'8px'} align={'center'} style={{ width: "180px" }}>
          <Text
              color="minorText"
              size="small"
          >
            To
          </Text>
          {columnFilters && columnFilters['to'] && <ColumnFilter initialValue={columnFilters['to'].value} onApply={columnFilters['to'].onApply} />}
        </Box>
      ),
      render: (data: RelatedTransaction) => <TransactionAddress id={id} address={data.to} width={'180px'} />,
    },
    {
      property: "value",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: "120px" }}
        >
          Value
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Box justify="center">
          <ONEValue value={data.value} timestamp={data.timestamp} />
        </Box>
      ),
    },

    {
      property: "timestamp",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: "140px" }}
        >
          Timestamp
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Box direction="row" gap="xsmall" justify="end">
          <DateTime date={data.timestamp} />
        </Box>
      ),
    },
  ];
}
