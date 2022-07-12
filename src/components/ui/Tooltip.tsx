import React from 'react'
import { Box, Text, BoxExtendedProps } from 'grommet'
import styled from "styled-components";

const ArrowDown = styled(Box)`
  position: absolute;
  top: 100%;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid ${(props) => props.theme.global.colors.backgroundTip};
  border-bottom: 0 solid transparent;
`

export interface TipContentProps extends BoxExtendedProps{
  message: string | JSX.Element,
  showArrow?: boolean
}

export const TipContent = (props: TipContentProps) => {
  let message = props.message
  if (typeof message === 'string') {
    message = <Text size={'small'}>{message}</Text>
  }
  return <Box
    direction="column"
    align="center"
    background="backgroundTip"
    pad={{ top: 'xxsmall', left: 'small', right: 'small', bottom: 'xxsmall' }}
    round={{ size: 'xsmall' }}
    animation={[{ type: 'fadeIn', duration: 350 }]}
    style={{ position: 'relative', color: 'white', width: 'fit-content', maxWidth: '400px' }}
    {...props}
  >
    <Box>{message}</Box>
    {props.showArrow &&
      <ArrowDown border={{ color: '#EFF8FF' }} />
    }
  </Box>
}
