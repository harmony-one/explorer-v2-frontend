import React, { useState } from "react";
import styled from "styled-components";
import { Down } from 'grommet-icons';
import { Box, DropButton, Text, Button } from 'grommet';
import { IHexSignature } from "../../types";
import { DisplaySignatureMethod } from "../../web3/parseByteCode";

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

export const TxInput = (props: { input: string, inputSignature: IHexSignature}) => {
  const [viewType, setViewType] = useState(ViewType.decoded)
  const [isOpened, setOpened] = useState(false)

  const onSelectOption = (option: ViewType) => {
    setOpened(false)
    setViewType(option)
  }

  const dropdownButton = isOpened ? <Down size={'small'} /> : <Down size={'small'} />

  return <div>
    <div>
      {viewType === ViewType.decoded &&
        <DisplaySignatureMethod
          input={props.input}
          signatures={[props.inputSignature]}
        />
      }
      {viewType === ViewType.hex &&
        <span>{props.input}</span>
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
