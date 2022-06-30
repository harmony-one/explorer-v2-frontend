import React from 'react'
import { Box } from 'grommet'
import styled from "styled-components";

const ArrowDown = styled(Box)`
  position: absolute;
  top: 100%;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid ${(props) => props.theme.global.colors.backgroundTip};
`

export const TipContent = (props: { message: string | JSX.Element }) => (
  <Box
    direction="column"
    align="center"
    background="backgroundTip"
    pad={{ top: 'xxsmall', left: 'small', right: 'small', bottom: 'xxsmall' }}
    round={{ size: 'xsmall' }}
    style={{ position: 'relative', color: 'white', width: 'fit-content' }}
  >
    <Box>{props.message}</Box>
    <ArrowDown border={{ color: '#EFF8FF' }} />
  </Box>
)
