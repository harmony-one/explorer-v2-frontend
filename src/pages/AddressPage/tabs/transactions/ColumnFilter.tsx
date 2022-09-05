import styled from "styled-components";
import {Box, Button, DropButton, Text, TextInput} from "grommet";
import React, {useState} from "react";
import {Filter as FilterIcon} from "grommet-icons/icons";
import {Close} from "grommet-icons";

interface ColumnFilterProps {
    initialValue?: string
    onApply: (value: string) => void
}

const FilterDropButton = styled(DropButton)`
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #e7ecf7;
  font-weight: normal;
  
  &:hover, &:active {
    box-shadow: 0 2px 6px rgb(119 131 143 / 35%);
  }
`

export const ColumnFilter = (props: ColumnFilterProps) => {
    const { initialValue = '', onApply } = props

    const [value, setValue] = useState(initialValue)
    const [isValueApplied, setValueApplied] = useState(!!initialValue)
    const [errorMsg, setErrorMsg] = useState('')

    const validateValue = (v: string) => {
        if(v.length > 0) {
            if(!v.startsWith('0x') && !v.startsWith('one1')) {
                return 'Address should start with 0x or one1'
            }
            if(v.length != 42) {
                return 'Address must be 42 characters long'
            }
        }
        return ''
    }

    const onApplyClicked = () => {
        const err = validateValue(value)
        setErrorMsg(err)

        if(!err) {
            onApply(value)
            setValueApplied(true)
        }
    }
    const onClearClicked = () => {
        if (isValueApplied) {
            onApply('')
        }
        setValue('')
        setValueApplied(false)
    }

    return <FilterDropButton
        label={<Box direction={'row'} gap={'8px'}>
            <FilterIcon size={'16px'} color={'text'} />
            {value && isValueApplied &&
                <Box direction={'row'} gap={'8px'} justify={'between'} align={'center'}>
                    <Text size={'12px'} color={'text'}>{value.slice(0, 5)}...{value.slice(-3)}</Text>
                    <Close size={'12px'} onClick={onClearClicked} />
                </Box>
            }
        </Box>}
        dropContent={
            <Box pad="small">
                <TextInput
                    placeholder={'Search by address e.g. 0x..'}
                    value={value}
                    size={'xsmall'}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={(e) => { if(e.charCode === 13) onApplyClicked() }}
                    style={{ fontWeight: 'normal' }}
                />
                {errorMsg && <Box margin={{ top: 'xsmall' }}>
                    <Text size={'xsmall'}>{errorMsg}</Text>
                </Box>}
                <Box direction={'row'} margin={{ top: 'small' }} gap={'8px'}>
                    <Button primary label={<Box direction={'row'} justify={'between'} align={'center'}>
                        <FilterIcon size={'12px'} color={'text'} />
                        <Text color={'text'} size={'12px'}>Filter</Text>
                    </Box>} onClick={onApplyClicked} />
                    <Button label={'Clear'} onClick={onClearClicked} style={{ fontSize: '12px' }} />
                </Box>
            </Box>
        }
        dropProps={{ margin: { top: '32px' }, round: '4px', background: 'background' }}
    />
}
