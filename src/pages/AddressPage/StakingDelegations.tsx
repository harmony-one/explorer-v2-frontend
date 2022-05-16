import React from 'react'
import { StakingDelegation } from "../../api/rpc";
import Big from "big.js";
import { Box } from "grommet";
import { Dropdown } from "../../components/dropdown/Dropdown";
import { useThemeMode } from "../../hooks/themeSwitcherHook";
import { Address, ONEValue } from "../../components/ui";

function DelegationsCount (props: { count: number }) {
  return <Box style={{ marginRight: "10px" }} direction={"row"}>
    <Box
      background={"backgroundBack"}
      style={{
        minWidth: "20px",
        height: "20px",
        marginLeft: "5px",
        textAlign: "center",
        borderRadius: "4px",
      }}
    >
      {props.count}
    </Box>
  </Box>
}

function StakingDelegations(props: { delegations: StakingDelegation[] }) {
  const { delegations } = props

  const themeMode = useThemeMode();

  let totalAmountBig = Big(0)
  let totalRewardsBig = Big(0)

  delegations.forEach(delegation => {
    totalAmountBig = totalAmountBig.plus(Big(delegation.amount))
    totalRewardsBig = totalRewardsBig.plus(Big(delegation.reward))
  })

  const totalAmount = totalAmountBig.div(Big(10 ** 18)).round(2).toString()
  const totalRewards = totalRewardsBig.div(Big(10 ** 18)).round(2).toString()

  const items: StakingDelegation[] = delegations.map(delegation => {
    return {
      ...delegation,
      amount: Big(delegation.amount).div(Big(10 ** 18)).round(2).toString(),
      reward: Big(delegation.reward).div(Big(10 ** 18)).round(2).toString()
    }
  })

  const dropdownProps = {
    keyField: 'validatorAddress',
    itemHeight: '55px',
    itemStyles: { padding: "5px", marginBottom: "10px" },
    themeMode,
    items,
    renderItem: (item: StakingDelegation) => {
      return <Box>
        <Box>
          <Address address={item.validatorAddress} />
        </Box>
        <Box>
          {item.amount} ONE, reward: {item.reward} ONE
        </Box>
      </Box>
    },
    renderValue: () => {
      return <Box direction={'row'}>
        {totalAmount} ONE, rewards: {totalRewards} ONE
        {items.length > 0 &&
          <DelegationsCount count={items.length} />
        }
      </Box>
    }
  }

  return <Box style={{ width: "550px" }}>
    <Dropdown<any> {...dropdownProps} />
  </Box>
}

export default StakingDelegations
