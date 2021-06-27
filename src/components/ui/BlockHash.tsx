import React from 'react'

import { Anchor } from 'grommet'
import {AnchorLink} from './AnchorLink'

// @ts-ignore
export const BlockHash = ({ hash }) => {
  const link = `/block/${hash}`
  return <AnchorLink to={link} label={hash} style={{fontWeight: 400}} />
}