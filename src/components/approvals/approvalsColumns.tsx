import { Box, ColumnConfig, Text } from 'grommet'
import { Address } from 'src/components/ui'
import React from 'react'
import styled from 'styled-components'
import { ApprovalDetails, RPCTransactionHarmony } from 'src/types';
const TabBox = styled(Box) <{ selected: boolean }>`
  border: 1px solid ${(props) => props.theme.global.colors.border};
  background: ${(props) =>
    props.selected ? props.theme.global.colors.backgroundBack : "transparent"};
  padding: 7px 12px 6px 12px;
  border-radius: 4px;
  margin: 5px 10px;
  text-align: center;
`;

export function getApprovalsColumns(revokeClicked:(tx:ApprovalDetails) => void): ColumnConfig<any>[] {
  return [
    {
      property: 'hash',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: '95px' }}
        >
          Hash
        </Text>
      ),
      render: (data: ApprovalDetails) => (
        <Address address={data.hash} type="tx" isShort />
      )
    },
    {
      property: 'lastUpdated',
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Last Updated (UTC)
        </Text>
      ),
      render: (data: ApprovalDetails) => {
        return (
          <Text size="12px">
            {data.lastUpdated.toLocaleString()}
          </Text>
        )
      }
    },
    {
      property: 'approvalType',
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          ApprovalType
        </Text>
      ),
      render: (data: ApprovalDetails) => {

        let value = data.tokenAmount;
        if (value === undefined || isNaN(value)) {
          value = data.tokenId;
        }

        return (
          <Text size="12px">
            {data.action} / {value || "ALL"}
          </Text>
        )
      }
    },
    {
      property: 'assets',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: '120px' }}
        >
          Assets
        </Text>
      ),
      render: (data: ApprovalDetails) => {
        return (<Address address={data.assetAddress} />)
      }
    },
    {
      property: 'spender',
      header: <Text
        color="minorText"
        size="small"
        style={{ fontWeight: 300, width: '120px' }}
      >
        Approved Spender
    </Text>,
      render: (data: ApprovalDetails) => {

        return (
          <Text size="12px">
            <Address address={data.spender} />
          </Text>
        )
      }
    },
    {
      property: 'allowance',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: '120px' }}
        >
          Allowance
        </Text>
      ),
      render: (data: ApprovalDetails) => {

        return (
          <Text size="12px">
            {data.allowance}
          </Text>)
      }
    },
    {
      property: 'action',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: '120px' }}
        >
          Action
        </Text>
      ),
      render: (data: ApprovalDetails) => {
        return (
          <TabBox onClick={e=>{revokeClicked(data)}} selected={true}>
            <Text size="small" color={"minorText"}>
              Revoke
            </Text>
          </TabBox>)
      }
    }
  ]
}
