import { Box } from "grommet";
import { useCurrency, setCurrency, getStoredValue, currencyType } from "../../hooks/ONE-ETH-SwitcherHook";
import styled from "styled-components";
import { useEffect, useState } from "react";

const SwitchButton = styled.div<{ selected: boolean }>`
  padding: 4px 10px;
  min-width: 20px;
  color: ${(props) => props.selected ? props.theme.global.colors.brand : props.theme.global.palette.LightGrey};
  font-weight: 700;
  user-select: none;
  outline: none;
  text-align: center;
  cursor: ${(props) => (props.selected ? "auto" : "pointer")};
  z-index: 1;
  transition: color 100ms ease-in-out;
`;

const SwitchContainer = styled(Box)`
  position: relative;
  box-shadow: ${(props) => `inset 0 0 0 1px ${props.theme.global.colors.backgroundBack}`};
  border-radius: 8px;
`

const OptionBackground = styled.div<{ selectedIndex: number }>`
  position: absolute;
  overflow: hidden;
  width: 50%;
  height: 100%;
  border-radius: 8px;
  pointer-events: none;
  background-color: ${(props) => props.theme.global.colors.backgroundBack};
  transform: ${(props) => props.selectedIndex === 0
          ? 'translateX(0%)'
          : 'translateX(100%)'};
  transition: transform 150ms ease-in-out;
`

export const AddressFormatSwitch = () => {
  const currency = useCurrency();
  const [addressFormat, setFormat] = useState(getStoredValue())   // Manually set value to avoid initial re-render and animation

  useEffect(() => {
    setFormat(currency)
  }, [currency])

  const options: currencyType[] = ['ONE', 'ETH']

  return <SwitchContainer direction="row">
    <OptionBackground selectedIndex={options.indexOf(addressFormat)} />
    {options.map(option => {
      return <SwitchButton
        key={option}
        selected={option === addressFormat}
        onClick={() => setCurrency(option)}>
        {option}
      </SwitchButton>
    })}
  </SwitchContainer>
}
