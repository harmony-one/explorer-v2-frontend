import React from "react";
import { Box } from "grommet";
import { Link } from "react-router-dom";
import styled from "styled-components";

export interface IExportButtonProps {
  address: string
  type: 'transactions'
}

const LinkText = styled.div`
  color: ${props => props.theme.global.colors.brand};
  font-weight: 700;
`

const TextContainer = styled.div`
  color: ${props => props.theme.global.colors.minorText};
  display: inline-block;
  font-size: 12px;
`

export const ExportToCsvButton = (props: IExportButtonProps) => {
  const {address, type} = props
  return <Box>
    <TextContainer>
      [ Download <Link to={`/exportData?address=${address}&type=${type}`} style={{ display: 'inline-block' }}>
      <LinkText>CSV export</LinkText>
    </Link> ]
    </TextContainer>
  </Box>
}
