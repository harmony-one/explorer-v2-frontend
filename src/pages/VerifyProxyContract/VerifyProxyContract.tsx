import React, { useEffect, useState } from "react";
import {Box, Heading, Select, Spinner, Text, TextArea, TextInput, Tip} from "grommet";
import { Alert, StatusGood } from "grommet-icons";
import { useHistory } from "react-router-dom";
import useQuery from "../../hooks/useQuery";
import {
    assignProxyImplementation,
    getProxyImplementation
} from "../../api/client";
import {Address, BaseContainer, BasePage, Button} from "../../components/ui";
import styled from "styled-components";

export const ActionButton = styled(Button)`
  font-size: 14px;
  padding: 8px 8px 5px 8px;
  font-weight: 500;
`;

export function VerifyProxyContract() {
    const query = useQuery();
    const history = useHistory();
    const queryAddress = query.get('a') || '';

    const [isLoading, setIsLoading] = useState(false)
    const [contractAddress, setContractAddress] = useState(queryAddress)
    const [implementationAddress, setImplementationAddress] = useState('')
    const [verificationError, setVerificationError] = useState('')
    const [isVerified, setIsVerified] = useState(false)

    const setDefaultState = () => {
        setImplementationAddress('')
        setVerificationError('')
        setIsVerified(false)
    }

    const verifyContract = async () => {
        try {
            setIsLoading(true)
            setVerificationError('')
            setImplementationAddress('')
            const proxyAddress = contractAddress.toLowerCase()
            const implContract = await getProxyImplementation([0, proxyAddress]);
            if(implContract) {
                setImplementationAddress(implContract.address)
            } else {
                setImplementationAddress('')
                setVerificationError('This contract does not look like it contains any delegatecall opcode sequence.')
            }
        } catch (e) {
            console.error('Unable to verify contract', e)
            setVerificationError('Cannot verify contract address, try again later')
        } finally {
            setIsLoading(false)
        }
    }

    const applyImplementationAddress = async () => {
        const contract = await assignProxyImplementation([0, contractAddress.toLowerCase(), implementationAddress])
        setDefaultState()
        setIsVerified(true)
    }

    const onChangeInput = (value: string) => {
        setContractAddress(value)
        setDefaultState()
    }

    return (
        <BaseContainer pad={{ horizontal: "0" }}>
            <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
                Proxy Contract Verification
            </Heading>
            <BasePage pad={"small"} style={{ overflow: "inherit" }}>
                <Box pad={'16px'} gap={'16px'} width={'600px'}>
                    <Box direction="row" justify={'start'} wrap>
                        <Box margin={'0'}>
                            <Text size={'small'}>Please enter the Proxy Contract Address you would like to verify</Text>
                            <Box direction="row">
                                <Box width={'550px'}>
                                    <TextInput
                                        placeholder={"ONE contract address"}
                                        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChangeInput(evt.currentTarget.value)}
                                        value={contractAddress}
                                        disabled={false}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    {!implementationAddress &&
                        <Box direction={'column'} gap={'16px'}>
                            {verificationError &&
                                <Box>
                                    <Text color={'red'} size={'small'}>{verificationError}</Text>
                                </Box>
                            }
                            {isVerified &&
                                <Box round={'8px'} background={'backgroundSuccess'} pad={'16px'}>
                                    <Text color={'successText'} size={'small'}>
                                        Successfully saved. Feel free to return to the address <Address address={contractAddress} hideCopyBtn={true} /> to view updates.
                                    </Text>
                                </Box>
                            }
                            <Box direction={'row'} gap={'16px'}>
                                <Box width={'small'}>
                                    <ActionButton
                                        disabled={!contractAddress || isLoading}
                                        onClick={verifyContract}>
                                        Verify
                                    </ActionButton>
                                </Box>
                                <Box width={'small'}>
                                    <ActionButton
                                        disabled={!contractAddress}
                                        onClick={() => {
                                            setDefaultState()
                                            setContractAddress('')
                                        }
                                    }>Clear</ActionButton>
                                </Box>
                            </Box>
                        </Box>
                    }
                    {implementationAddress &&
                        <Box direction={'column'} gap={'16px'}>
                            <Box>
                                <Text size={'small'}>The proxy's implementation contract is found at:</Text>
                                <Text size={'small'} weight={'bold'} color={'successText'}>{implementationAddress}</Text>
                            </Box>
                            <Box direction={'row'} gap={'16px'}>
                                <Box width={'small'}>
                                    <ActionButton
                                        disabled={isLoading}
                                        onClick={applyImplementationAddress}>Save</ActionButton>
                                </Box>
                                <Box width={'small'}><ActionButton onClick={setDefaultState}>Clear</ActionButton></Box>
                            </Box>
                        </Box>
                    }
                </Box>
            </BasePage>
        </BaseContainer>
    )
}
