import React from 'react'
import { StakingDelegation } from "../../api/rpc";
import Big from "big.js";
import { Box, Text } from "grommet";
import { Dropdown } from "../../components/dropdown/Dropdown";
import { useThemeMode } from "../../hooks/themeSwitcherHook";
import { Address, ONEValue } from "../../components/ui";

Big.PE = 30

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

  const items: StakingDelegation[] = delegations.filter(item => (+item.amount > 0 || +item.reward > 0))

  const dropdownProps = {
    keyField: 'validatorAddress',
    itemHeight: '70px',
    itemStyles: { marginBottom: "0px" },
    themeMode,
    items,
    renderItem: (item: StakingDelegation) => {
      return <Box
        background={"backgroundDropdownItem"}
        direction="column"
        pad={'4px'}
        gap={'4px'}
        margin={{bottom: '8px'}}
      >
        <Box>
          <Address address={item.validatorAddress} />
        </Box>
        <Box direction={'row'} gap={'8px'}>
          <Text size={'small'}>Stake</Text>
          {+item.amount > 0 ? <ONEValue value={item.amount} /> : '0 ONE'}
        </Box>
        <Box direction={'row'} gap={'8px'}>
          <Text size={'small'}>Reward</Text>
          {+item.reward > 0 ? <ONEValue value={item.reward} />: '0 ONE'}
        </Box>
        {item.undelegations.length > 0 &&
          item.undelegations.map((undelegation) => {
            return <Box direction={'row'} gap={'8px'}>
              <Text size={'small'}>Undelegation (Epoch {undelegation.epoch})</Text>
              {+item.reward > 0 ? <ONEValue value={undelegation.amount} />: '0 ONE'}
            </Box>
          })
        }
      </Box>
    },
    renderValue: () => {
      return <Box direction={'row'} pad={{ top: '2px' }}>
        <ONEValue value={totalAmountBig.toString()} />
        {items.length > 0 &&
          <DelegationsCount count={items.length} />
        }
      </Box>
    }
  }

  return <Box style={{ width: "550px" }}>
    {(+totalAmount > 0 || +totalRewards > 0)
      ? <Dropdown<any> {...dropdownProps} />
      : <Text size={'small'}>0 ONE</Text>
    }
  </Box>
}

export default StakingDelegations
