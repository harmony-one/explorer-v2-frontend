import React from 'react'
import {Box, Text} from "grommet";
import {MetricsTopPeriod} from "../../types";

const OptionAlias = {
    [MetricsTopPeriod.d1]: '1 Day',
    [MetricsTopPeriod.d3]: '3 Days',
    [MetricsTopPeriod.d7]: '7 Days',
}

export const ChartOptions = Object.values(MetricsTopPeriod).filter(v => typeof v === 'number') as MetricsTopPeriod[]

const Option = (props: { value: MetricsTopPeriod, isActive: boolean, onSelect: (value: MetricsTopPeriod) => void }) => {
    const {value, isActive, onSelect} = props
    return <Box
        align={'center'}
        pad={'8px'}
        round={'8px'}
        background={isActive ? 'background' : 'unset'}
        onClick={() => onSelect(value)}
        style={{ cursor: 'pointer', fontWeight: isActive ? 'bold': 'normal' }}
    >
        <Text size='small'>{OptionAlias[value]}</Text>
    </Box>
}

export interface OptionsSelectProps {
    activeOption: MetricsTopPeriod
    onSelect: (option: MetricsTopPeriod) => void
    disabled?: boolean
}

export const OptionsSelect = (props: OptionsSelectProps) => {
    const { activeOption, disabled, onSelect } = props

    return <Box
        direction={'row'}
        justify={'between'}
        pad={'4px'}
        gap={'8px'}
        round={'8px'}
        background={'backgroundBack'}
        border={{ size: '1px' }}
    >
        {ChartOptions.map(option => <Option
            key={option}
            value={option}
            isActive={activeOption === option}
            onSelect={(option) => !disabled ? onSelect(option) : undefined}
        />)}
    </Box>
}
