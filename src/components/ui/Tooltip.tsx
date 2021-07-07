import React from 'react'

import { grommet, Box, Button, Grommet, Heading, Text, Tip } from 'grommet'
import { Trash } from 'grommet-icons'

// @ts-ignore
export const TipContent = ({ message }) => (
  <Box direction="row" align="center">
    <Box background="background" direction="row" pad="small" border={{color: 'border', size: '0px' }}>
      <div>{message}</div>
    </Box>
  </Box>
)