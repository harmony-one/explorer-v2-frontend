import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Down } from 'grommet-icons';
import { Box, DropButton, Text, Button, TextArea } from "grommet";
import { IHexSignature } from "../../types";
import { DisplaySignatureMethod } from "../../web3/parseByteCode";
import { CopyBtn } from "../ui/CopyBtn";
import { parseHexToText } from "../../web3/parseHex";

enum ViewType {
  hex = 'hex',
  decoded = 'decoded',
  utf8 = 'utf8'
}

const defaultViewType = ViewType.hex

const ViewTypeName = {
  [ViewType.decoded]: 'Default view',
  [ViewType.hex]: 'Original',
  [ViewType.utf8]: 'UTF-8',
}

interface IDropContentProps {
  currentOption: ViewType;
  options: ViewType[];
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
  &:not(:first-child) {
    margin-top: 8px;
  }
`

const DropContentContainer = styled(Box)`
  padding: 12px;
`

const DropContent = (props: IDropContentProps) => {
  const { options, currentOption, onSelectOption } = props
  return <DropContentContainer>
    {options.map(option => <OptionItem
      key={option}
      isSelected={currentOption === option}
      onClick={() => onSelectOption(option)}>
      {ViewTypeName[option]}
    </OptionItem>)}
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

const ReadableText = (props: { value: string }) => {
  return <TextArea style={{ minHeight: "40px" }} rows={2} value={props.value}/>
}

export const TxInput = (props: { input: string, inputSignature?: IHexSignature}) => {
  const { inputSignature } = props
  const [viewType, setViewType] = useState(ViewType.hex)
  const [dropdownOptions, setDropdownOptions] = useState([defaultViewType])
  const [inputUTF8Text, setInputUTF8Text] = useState('')
  const [isOpened, setOpened] = useState(false)

  useEffect(() => {
    if (props.inputSignature) {
      setViewType(ViewType.decoded)
      setDropdownOptions([ViewType.hex, ViewType.decoded])
      setInputUTF8Text('')
    } else {
      try {
        const text = parseHexToText(props.input)
        if (text) {
          setInputUTF8Text(text)
          setViewType(ViewType.utf8)
          setDropdownOptions([ViewType.hex, ViewType.utf8])
        }
      } catch (e) {
        console.log('Tx input hex is not an UTF8 string:', (e as Error).message)
        setViewType(defaultViewType)
        setInputUTF8Text('')
        setDropdownOptions([defaultViewType])
      }
    }
  }, [props.input, props.inputSignature])

  const onSelectOption = (option: ViewType) => {
    setOpened(false)
    setViewType(option)
  }

  const dropContent = <DropContent
    options={dropdownOptions}
    currentOption={viewType}
    onSelectOption={onSelectOption}
  />

  return <div style={{ width: '100%' }}>
    <div>
      {(viewType === ViewType.decoded && inputSignature) &&
        <DisplaySignatureMethod
          input={props.input}
          signatures={[inputSignature]}
        />
      }
      {viewType === ViewType.hex &&
        <RawInput value={'' + props.input} />
      }
      {(viewType === ViewType.utf8 && inputUTF8Text) &&
        <ReadableText value={inputUTF8Text} />
      }
    </div>
    {dropdownOptions.length > 1 &&
      <div>
        <DropButton
          style={{ borderRadius: '4px' }}
          open={isOpened}
          onClose={() => setOpened(false)}
          onOpen={() => setOpened(true)}
          dropContent={dropContent}
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
    }
  </div>
}
