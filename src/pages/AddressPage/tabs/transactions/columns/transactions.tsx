import { Box, ColumnConfig, Text, Tip } from "grommet";
import React from "react";
import { RelatedTransaction } from "../../../../../types";
import { Address, DateTime, ONEValue } from "../../../../../components/ui";
import { NeutralMarker, TransactionAddress, TransferDirectionMarker, TxMethod } from "./common";

export function getColumns(id: string): ColumnConfig<any>[] {
  return [
    // {
    //   property: "type",
    //   size: "",
    //   header: (
    //     <Text
    //       color="minorText"
    //       size="small"
    //       style={{ fontWeight: 300, width: "140px" }}
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
          style={{ fontWeight: 300, width: "95px" }}
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
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
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

        return (
          <Tip content={<span>{signature}</span>}>
            <TxMethod size="10px">
              <NeutralMarker background={"backgroundBack"}>
                {signature}
              </NeutralMarker>
            </TxMethod>
          </Tip>
        );
      },
    },
    // {
    //   property: "shard",
    //   header: (
    //     <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
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
          style={{ fontWeight: 300, width: "180px" }}
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
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "180px" }}
        >
          To
        </Text>
      ),
      render: (data: RelatedTransaction) => <TransactionAddress id={id} address={data.to} width={'180px'} />,
    },
    {
      property: "value",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "120px" }}
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
          style={{ fontWeight: 300, width: "140px" }}
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
