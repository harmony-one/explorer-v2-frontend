import React, {useState} from 'react'
import {Box} from "grommet";

export enum ChartOption {
    month = 'month',
    month3 = 'month3',
    year = 'year',
    ytd = 'ytd',
    all = 'all'
}

const OptionAlias = {
    [ChartOption.month]: '1M',
    [ChartOption.month3]: '3M',
    [ChartOption.year]: ['1Y'],
    [ChartOption.ytd]: ['YTD'],
    [ChartOption.all]: ['ALL'],
}

export const ChartOptions = Object.values(ChartOption)

const Option = (props: { value: ChartOption, isActive: boolean, onSelect: (value: ChartOption) => void }) => {
    const {value, isActive, onSelect} = props

    return <Box
        round={'8px'}
        pad={'4px'}
        width={'48px'}
        background={isActive ? 'background' : 'unset'}
        align={'center'}
        onClick={() => onSelect(value)}
        style={{ cursor: 'pointer', fontWeight: isActive ? 'bold': 'normal' }}
    >
        {OptionAlias[value]}
    </Box>
}

export interface ChartFilterProps {
    activeOption: ChartOption
    onSelect: (option: ChartOption) => void
    disabled?: boolean
}

export const ChartFilter = (props: ChartFilterProps) => {
    const { activeOption, disabled, onSelect } = props

    return <Box
        pad={'4px'}
        direction={'row'}
        gap={'8px'}
        round={'8px'}
        background={'backgroundMark'}
    >
        {ChartOptions.map(option => <Option
            key={option}
            value={option}
            isActive={activeOption === option}
            onSelect={(option) => !disabled ? onSelect(option) : undefined}
        />)}
    </Box>
}
