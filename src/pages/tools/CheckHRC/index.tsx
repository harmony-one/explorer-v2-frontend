import React, { useEffect, useState } from "react";
import { Box, Heading, Select, Spinner, Text, TextArea, TextInput, Tip } from "grommet";
import { Alert, StatusGood } from "grommet-icons";
import { BaseContainer, BasePage } from "../../../components/ui";
import useQuery from "../../../hooks/useQuery";
import { getContractsByField } from "../../../api/client";
import styled from "styled-components";
import { AddressDetails } from "../../../types";
import { ABIManager, IABI } from "src/web3/ABIManager";
import ERC20ABI from 'src/web3/abi/ERC20ABI.json'
import ERC721ABI from 'src/web3/abi/ERC721ABI.json'
import ERC1155ABI from 'src/web3/abi/ERC1155ABI.json'
import { copyTextToClipboard } from "../../../utils";
import { toaster } from "../../../App";
import { useHistory } from "react-router-dom";

const StyledTextArea = styled(TextArea)`
  padding: 0.75rem;
  border-radius: 0.35rem;
  font-weight: normal;
`;

const ErrorMessage = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.global.colors.errorText};
`

const EventsWrapper = styled(Box)`
  flex-wrap: wrap;
  row-gap: 16px;
  column-gap: 16px;
`

const EventContainer = styled.div<{ isMatched: boolean }>`
  border-radius: 2px;
  padding: 5px;
  background: ${(props) => props.theme.global.colors.backgroundBack};

  text-align: center;
  font-weight: bold;
  cursor: pointer;

  ${(props) => !props.isMatched && `
    color: ${props.theme.global.colors.minorText};
    font-weight: normal;
    text-decoration: line-through;
  `};
`

enum ContractType {
  'erc20' = 'ERC20',
  'erc721' = 'ERC721',
  'erc1155' = 'ERC1155'
}

const methods = {
  [ContractType.erc20]: [
    'Transfer',
    'Approval',
    'totalSupply',
    'decimals',
    'transfer',
    'balanceOf',
    'symbol',
    'name',
    'approve',
  ],
  [ContractType.erc721]: [
    'Transfer',
    'Approval',
    'totalSupply',
    'ownerOf',
    'tokenURI',
    'transferFrom',
    'safeTransferFrom',
    'balanceOf',
    'symbol',
    'name',
    'approve',
  ],
  [ContractType.erc1155]: [
    'TransferSingle',
    'TransferBatch',
    // 'totalSupply',
    'owner',
    'tokenURIPrefix',
    'balanceOfBatch',
    'contractURI',
  ]
}

const erc20ABIManager = ABIManager(ERC20ABI as IABI)
const erc721ABIManager = ABIManager(ERC721ABI as IABI)
const erc1155ABIManager = ABIManager(ERC1155ABI as IABI)

export function CheckHRC() {
  const query = useQuery();
  const history = useHistory();
  const queryAddress = query.get('address') || '';
  const initialId = queryAddress

  const [contractAddress, setContractAddress] = useState(initialId)
  const [contractType, setContractType] = useState(ContractType.erc20)
  const [matchedEvents, setMatchedEvents] = useState<string[]>([])
  const [contractData, setContractData] = useState<AddressDetails | null>(null)
  const [contractError, setContractError] = useState('')
  const [isContractLoading, setContractLoading] = useState(false)

  const getAbiManager = () => {
    if (contractType === ContractType.erc20) {
      return erc20ABIManager
    } else if(contractType === ContractType.erc721) {
      return erc721ABIManager
    }
    return erc1155ABIManager
  }

  const geMethodSignature = (name: string) => {
    const abiManager = getAbiManager()
    const entry = abiManager.getEntryByName(name)
    if (entry) {
      const { signatureWithout0x } = entry
      return signatureWithout0x
    }
    return ''
  }

  const onEventClicked = (name: string) => {
    const signature = geMethodSignature(name)
    copyTextToClipboard(signature)
    toaster.show({
      message: () => (
        <Box direction={"row"} align={"center"} pad={"small"}>
          <StatusGood size={"small"} color={"headerText"} style={{ marginRight: '5px' }}/>
          <Text size={"small"}>Signature copied to clipboard</Text>
        </Box>
      )
    })
  }

  const onContractLoaded = (bytecode: string) => {
    const matched = {
      [ContractType.erc20]: erc20ABIManager.getMatchingSignatures(methods[ContractType.erc20], bytecode),
      [ContractType.erc721]: erc721ABIManager.getMatchingSignatures(methods[ContractType.erc721], bytecode),
      [ContractType.erc1155]: erc1155ABIManager.getMatchingSignatures(methods[ContractType.erc1155], bytecode),
    }

    let type = ContractType.erc20
    if (matched[ContractType.erc721].length === methods[ContractType.erc721].length) {
      type = ContractType.erc721
    } else if (matched[ContractType.erc1155].length === methods[ContractType.erc1155].length) {
      type = ContractType.erc1155
    }

    setContractType(type)
    setMatchedEvents(matched[type])
  }

  useEffect(() => {
    const getContract = async () => {
      setContractLoading(true)
      try {
        let contract: any = await getContractsByField([0, "address", contractAddress]);
        setContractData(contract)
        onContractLoaded(contract.bytecode)
      } catch (e) {
        const message = e && (e as Error).message ? (e as Error).message : 'Unknown error'
        console.error('Cannot get contract by id:', contractAddress, e)
        setContractError(message)
      } finally {
        setContractLoading(false)
      }
    }
    setContractData(null)
    setContractError('')
    setMatchedEvents([])
    if (contractAddress) {
      history.push({
        pathname: "/tools/checkHrc",
        search: `?address=${contractAddress}`
      });
      getContract()
    } else {

    }
  }, [contractAddress])

  const isAllEventsMatched = matchedEvents.length === methods[contractType].length

  return (
    <BaseContainer pad={{ horizontal: "0" }}>
      <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
        Check HRC
      </Heading>
      <BasePage pad={"small"} style={{ overflow: "inherit" }}>
        <Box>
          <Box direction="row" justify={'start'} wrap pad={'16px'} gap={'16px'}>
            <Box margin={'0'}>
              <Text>Contract Address</Text>
              <Box direction="row">
                <Box width={'550px'}>
                  <TextInput
                    placeholder={"ONE contract address"}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      setContractAddress(evt.currentTarget.value)
                    }}
                    value={contractAddress}
                    disabled={false}
                  />
                </Box>
              </Box>
            </Box>
            <Box>
              <Text>Contract type</Text>
              <Select
                options={[ContractType.erc20, ContractType.erc721, ContractType.erc1155]}
                value={contractType}
                onChange={({ option }) => setContractType(option)
                }
                disabled={isContractLoading}
              />
            </Box>
            {isContractLoading &&
              <Box justify="center" align="center" margin={'24px 0 0 24px'}>
                <Spinner />
              </Box>
            }
            {(!isContractLoading && contractAddress) &&
              <Box justify="center" align="center" margin={'24px 0 0 24px'}>
                {isAllEventsMatched
                  ? <Tip content={'All events found'}><StatusGood size="medium" color={'successText'} /></Tip>
                  : <Tip content={'Some events missing'}><Alert size="medium" color={'minorText'} /></Tip>}
              </Box>
            }
        </Box>
          {!isContractLoading && contractError &&
            <Box margin={'0'} pad={'0 0 0 16px'}>
              <ErrorMessage style={{ width: '500px' }}>{contractError}</ErrorMessage>
            </Box>
          }
        </Box>
        {contractAddress &&
          <Box direction="column" justify="between" wrap pad={'16px'}>
            <Box>
              Required events:
            </Box>
            <EventsWrapper direction={'row'}>
              {methods[contractType].map((name) => {
                const isMatched = !!matchedEvents.find(matchedName => matchedName === name)
                const signature = geMethodSignature(name)
                return <Tip content={`Signature: ${signature}`}>
                  <EventContainer onClick={() => onEventClicked(name)} isMatched={isMatched}>
                    {name}
                  </EventContainer>
                </Tip>
              })}
            </EventsWrapper>
          </Box>
        }
        <Box direction="column" justify="between" wrap pad={'16px'}>
          <StyledTextArea
            readOnly={true}
            rows={7}
            cols={100}
            value={contractData ? contractData.bytecode : ""} placeholder={'Bytecode'}
          />
        </Box>
      </BasePage>
    </BaseContainer>
  )
}
