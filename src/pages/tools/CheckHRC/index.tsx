import React, { useEffect, useState } from "react";
import { Box, Heading, Select, Spinner, Text, TextArea, TextInput } from "grommet";
import { BaseContainer, BasePage } from "../../../components/ui";
import useQuery from "../../../hooks/useQuery";
import { getContractsByField } from "../../../api/client";
import styled from "styled-components";
import { AddressDetails } from "../../../types";
import { ABIManager, IABI } from "src/web3/ABIManager";
import ERC20ABI from 'src/web3/abi/ERC20ABI.json'
import ERC721ABI from 'src/web3/abi/ERC721ABI.json'
import ERC1155ABI from 'src/web3/abi/ERC1155ABI.json'

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

const erc20Methods = [
  'Transfer',
  'Approval',
  'totalSupply',
  'decimals',
  'transfer',
  'balanceOf',
  'symbol',
  'name',
  'approve',
]

const erc721Methods = [
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
]

const erc1155Methods = [
  'TransferSingle',
  'TransferBatch',
  // 'totalSupply',
  'owner',
  'tokenURIPrefix',
  'balanceOfBatch',
  'contractURI',
]

enum ContractType {
  'erc20' = 'ERC20',
  'erc721' = 'ERC721',
  'erc1155' = 'ERC1155'
}

const erc20ABIManager = ABIManager(ERC20ABI as IABI)
const erc721ABIManager = ABIManager(ERC721ABI as IABI)
const erc1155ABIManager = ABIManager(ERC1155ABI as IABI)

export function CheckHRC() {
  const query = useQuery();
  const queryAddress = query.get('address') || '';
  console.log('queryAddress', queryAddress)
  const initialId = queryAddress

  const [contractAddress, setContractAddress] = useState(initialId)
  const [contractType, setContractType] = useState(ContractType.erc20)
  const [matchedEvents, setMatchedEvents] = useState<string[]>([])
  const [contractData, setContractData] = useState<AddressDetails | null>(null)
  const [contractError, setContractError] = useState('')
  const [isContractLoading, setContractLoading] = useState(false)

  const onContractLoaded = (bytecode: string) => {
    const matchedEvents = {
      [ContractType.erc20]: erc20ABIManager.getMatchingSignatures(erc20Methods, bytecode),
      [ContractType.erc721]: erc721ABIManager.getMatchingSignatures(erc721Methods, bytecode),
      [ContractType.erc1155]: erc1155ABIManager.getMatchingSignatures(erc1155Methods, bytecode),
    }

    let matchedContractType = ContractType.erc20

    if (matchedEvents[ContractType.erc721].length === erc721Methods.length) {
      matchedContractType = ContractType.erc721
    } else if (matchedEvents[ContractType.erc1155].length === erc1155Methods.length) {
      matchedContractType = ContractType.erc1155
    }

    setContractType(matchedContractType)
    setMatchedEvents(matchedEvents[matchedContractType])
  }

  useEffect(() => {
    const getContract = async () => {
      setContractLoading(true)
      setContractData(null)
      setContractError('')
      try {
        let contract: any = await getContractsByField([0, "address", contractAddress]);
        setContractData(contract)
        onContractLoaded(contract.bytecode)
      } catch (e) {
        console.error('Cannot get contract by id:', contractAddress, (e as Error).message)
        setContractError((e as Error).message || 'Unknown error')
      } finally {
        setContractLoading(false)
      }
    }
    getContract()
  }, [contractAddress])

  return (
    <BaseContainer pad={{ horizontal: "0" }}>
      <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
        Check HRC
      </Heading>
      <BasePage pad={"small"} style={{ overflow: "inherit" }}>
        <Box>
          <Box direction="row" justify={'start'} wrap pad={'16px'}>
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
            <Box pad={{left: '16px'}}>
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
              <Box justify="center" align="center" margin={'0 0 0 24px'}>
                <Spinner />
              </Box>
            }
        </Box>
          {!isContractLoading && contractError &&
            <Box margin={'0'} pad={'0 0 0 16px'}>
              <ErrorMessage style={{ width: '500px' }}>{contractError}</ErrorMessage>
            </Box>
          }
        </Box>
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
