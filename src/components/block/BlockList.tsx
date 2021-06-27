import React, { FunctionComponent, useState } from 'react'
import { Block } from '../../types'
import {
  blockPropertyDisplayNames,
  blockPropertySort,
  blockPropertyDescriptions,
  blockDisplayValues
} from './helpers'
import { TipContent } from 'src/components/ui'
import {
  Box,
  DataTable,
  Tip,
  Anchor
} from 'grommet'

import { CircleQuestion, CaretDownFill, CaretUpFill } from 'grommet-icons'

const columns = [
  {
    property: 'shardID',
  },
  {
    property: 'timestamp',
  },
  {
    property: 'transactions',
  },
  {
    property: 'miner'
  },
  {
    property: 'gasUsed',
  },
  {
    property: 'gasLimit'
  }
]

type BlockDetailsProps = {
  block: Block
}
type tableEntry = {
  key: string,
  value: any
}

export const BlockList: FunctionComponent<BlockDetailsProps> = ({ block }) => {
  const [showDetails, setShowDetails] = useState(true)

  const keys = Object.keys(block)
  const sortedKeys = keys.sort((a, b) => blockPropertySort[b] - blockPropertySort[a])
  // show first 8 till gas used
  const filteredKeys = sortedKeys.filter((k, i) => showDetails || i < 8)
  const blockData = filteredKeys
    .reduce((arr, key) => {
      // @ts-ignore
      const value = blockDisplayValues(block, key, block[key])
      arr.push({ key, value } as tableEntry)
      return arr
    }, [] as tableEntry[])

  return <>
    <Box flex align="start" justify="start">
      <div>
        <b>Block</b> #{block.number}
      </div>
      <DataTable
        style={{ width: '100%' }}
        columns={columns}
        data={blockData}
        step={10}
        border={{
          header: {
            color: 'none'
          },
          body: {
            color: 'border',
            side: 'top',
            size: '1px'
          }
        }}
      />
      <Anchor onClick={() => setShowDetails(!showDetails)}>
        {showDetails
          ? <>Show less&nbsp;
            <CaretUpFill size="small" /></>
          : <>Show more&nbsp;
            <CaretDownFill size="small" /></>
        }
      </Anchor>
    </Box>
  </>
}