import React, { useState } from "react";
import { Close } from 'grommet-icons';
import { Box, Button, DropButton, Heading, Select, Text } from "grommet";
import { IHexSignature } from "../../types";
import { DisplaySignatureMethod } from "../../web3/parseByteCode";

enum ViewType {
  decoded = 'Decoded',
  hex = 'Original'
}

const options = [
  { label: ViewType.decoded, value: 1 },
  { label: ViewType.hex, value: 2 },
];

export const TxInput = (props: { input: string, inputSignature: IHexSignature}) => {
    const [viewType, setViewType] = useState(options[0])
    return <div>
      <div>
        {viewType.label === ViewType.decoded &&
          <DisplaySignatureMethod
            input={props.input}
            signatures={[props.inputSignature]}
          />
        }
        {viewType.label === ViewType.hex &&
          <span>{props.input}</span>
        }
      </div>
      <div>
        <Select
          plain={true}
          size={'small'}
          options={options}
          value={viewType}
          labelKey={'label'}
          valueKey={'value'}
          onChange={({ option }) => setViewType(option)}
        />
      </div>
    </div>
}
