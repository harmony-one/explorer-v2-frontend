import {Box, ColumnConfig, Text, Tip} from "grommet";
import React from "react";
import { RelatedTransaction } from "../../../../../types";
import { Address, DateTime, ONEValue, TipContent } from "../../../../../components/ui";
import { TransactionAddress, TransferDirectionMarker, TxMethod } from "./common";
import {ColumnFilter} from "../ColumnFilter";

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
          {columnFilters && columnFilters['to'] &&
              <ColumnFilter
                  initialValue={columnFilters['to'].value}
                  onApply={columnFilters['to'].onApply}
              />}
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
