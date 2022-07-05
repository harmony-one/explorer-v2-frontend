import React from 'react'
import { Box, Text } from 'grommet'
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

export const TipContent = (props: { message: string | JSX.Element, showArrow?: boolean }) => {
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
  >
    <Box>{message}</Box>
    {props.showArrow &&
      <ArrowDown border={{ color: '#EFF8FF' }} />
    }
  </Box>
}
