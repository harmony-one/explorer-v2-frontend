import React, { useState } from "react";
import styled from "styled-components";
import { Down } from 'grommet-icons';
import { Box, DropButton, Text, Button } from 'grommet';
import { IHexSignature } from "../../types";
import { DisplaySignatureMethod } from "../../web3/parseByteCode";
import { CopyBtn } from "../ui/CopyBtn";

enum ViewType {
  decoded = 'decoded',
  hex = 'hex'
}

interface IDropContentProps {
  currentOption: ViewType;
  onSelectOption: (option: ViewType) => void;
}

const OptionItem = styled(Text)<{ isSelected: boolean }>`
  cursor: pointer;
  color: ${(props) => props.isSelected
          ? props.theme.global.colors.brand
          : props.theme.global.colors.text};
  font-size: 14px;
  
  &:hover {
    color: ${(props) => props.theme.global.colors.brand};
  }
`

const DropContentContainer = styled(Box)`
  padding: 12px;
`

const DropContent = (props: IDropContentProps) => {
  const { currentOption, onSelectOption } = props
  return <DropContentContainer>
    <OptionItem
      isSelected={currentOption === ViewType.decoded}
      onClick={() => onSelectOption(ViewType.decoded)}>
      Default view
    </OptionItem>
    <OptionItem
      isSelected={currentOption === ViewType.hex}
      onClick={() => onSelectOption(ViewType.hex)}>
      Original
    </OptionItem>
  </DropContentContainer>
}

const RawInput = (props: { value: string }) => {
  let displayValue = props.value
  if (displayValue && displayValue.length && displayValue.length > 66) {
    displayValue = displayValue.slice(0, 63) + "...";
  }
  return <Box direction="row" align="baseline">
    <CopyBtn value={props.value} showNotification={true} /> &nbsp;
    <span title={props.value}>{displayValue}</span>
  </Box>
}

export const TxInput = (props: { input: string, inputSignature?: IHexSignature}) => {
  const { inputSignature } = props
  const [viewType, setViewType] = useState(ViewType.decoded)
  const [isOpened, setOpened] = useState(false)

  const onSelectOption = (option: ViewType) => {
    setOpened(false)
    setViewType(option)
  }

  if (inputSignature) {
    return <div>
      <div>
        {viewType === ViewType.decoded &&
          <DisplaySignatureMethod
            input={props.input}
            signatures={[inputSignature]}
          />
        }
        {viewType === ViewType.hex &&
          <RawInput value={'' + props.input} />
        }
      </div>
      <div>
        <DropButton
          style={{ borderRadius: '4px' }}
          open={isOpened}
          onClose={() => setOpened(false)}
          onOpen={() => setOpened(true)}
          dropContent={<DropContent
            currentOption={viewType}
            onSelectOption={onSelectOption}
          />}
          dropProps={{ align: { top: 'bottom' }, margin: { left: 'xsmall' }, round: '6px' }}
        >
          <Box
            direction="row"
            gap="medium"
            align="start"
            pad="xsmall">
            <Button
              size="small"
              label="View input as"
              icon={<Down size={'small'} />}
              reverse
              style={{ borderRadius: '6px', padding: '3px 8px' }}
            />
          </Box>
        </DropButton>
      </div>
    </div>
  }

  return <RawInput value={'' + props.input} />
}
