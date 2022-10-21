import {Box, Spinner, Text, TextInput} from 'grommet';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Button} from 'src/components/ui/Button';
import Web3 from 'web3';
import {AbiItem} from 'web3-utils';
import {convertInputs} from './helpers';
import {uniqid} from 'src/pages/VerifyContract/VerifyContract';
import detectEthereumProvider from '@metamask/detect-provider';
import {AbiParam} from 'src/components/ui/AbiParam';

const Field = styled(Box)``;

const ViewWrapper = styled(Box)`
  border: 1px solid #e7ecf7;
  border-radius: 5px;
`;

const NameWrapper = styled(Box)`
  border-bottom: 1px solid #e7ecf7;
  padding: 10px;
  opacity: 0.7;
  border-radius: 5px;
`;

const SmallTextInput = styled(TextInput)`
  font-size: 14px;
  font-weight: 400;

  ::placeholder {
    font-size: 14px;
  }
`;

export const ActionButton = styled(Button)`
  font-size: 14px;
  padding: 7px 8px 5px 8px;
  font-weight: 500;
`;

const GreySpan = styled('span')`
  font-size: 14px;
  opacity: 0.7;
  font-weight: 400;
`;

const TextBold = styled(Text)`
  font-weight: bold;
`;

const GAS_LIMIT = 6721900;
const GAS_PRICE = 30000000000;

export const AbiMethodsView = (props: {
  abiMethod: AbiItem;
  address: string;
  metamaskAddress?: string;
  index: number;
  isRead?: boolean;
  validChainId?: boolean;
}) => {
  const {abiMethod, address, index} = props;
  const [inputsValue, setInputsValue] = useState<string[]>(
    [...new Array(abiMethod.inputs?.length)].map(() => '')
  );
  const [multipleValue, setMultipleValue] = useState({
    write: {},
    read: {},
  } as any);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const query = async () => {
    try {
      setError('');
      setResult([]);
      setLoading(true);

      // fix when there are multiple ethereum providers; detect it! returns actual provider
      const web3:any = await detectEthereumProvider();

      const web3URL = props.isRead
        ? process.env.REACT_APP_RPC_URL_SHARD0
        : web3
          ? web3
          : process.env.REACT_APP_RPC_URL_SHARD0;

      const hmyWeb3 = new Web3(web3URL);

      const contract = new hmyWeb3.eth.Contract([abiMethod], address);

      if (abiMethod.name) {
        let res;

        if (abiMethod.stateMutability === 'view') {
          res = await contract.methods[abiMethod.name]
            .apply(contract, convertInputs(inputsValue, abiMethod.inputs || []))
            .call();
        } else {
          // @ts-ignore
          const accounts = await ethereum.enable();

          const account = accounts[0] || undefined; // if function is not a view method it will require a signer

          console.log("account is", account);

          res = await contract.methods[abiMethod.name]
            .apply(contract, convertInputs(inputsValue, abiMethod.inputs || []))
            .send({
              gasLimit: GAS_LIMIT,
              gasPrice: GAS_PRICE,
              from: account,
              value: Number(amount) * 1e18,
            });
        }

        setResult(
          Array.isArray(res)
            ? res
            : typeof res === 'object'
              ? Object.values(res)
              : [res.toString()]
        );
      }
    } catch (e) {
      // @ts-ignore
      setError(e.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (
      abiMethod.stateMutability !== 'payable' &&
      (!abiMethod.inputs || !abiMethod.inputs.length) &&
      props.isRead
    ) {
      query();
    }
  }, []);

  const setInputValue = (value: string, idx: number) => {
    const newArr = inputsValue.map((v, i) => (i === idx ? value : v));
    setInputsValue(newArr);
  };

  return (
    <ViewWrapper className='abi-view-wrapper' direction='column' margin={{bottom: 'medium'}}>
      <NameWrapper background={'backgroundBack'}>
        <Text size='small'>
          {index + 1}. {abiMethod.name}
        </Text>
      </NameWrapper>

      <Box pad='20px'>
        {abiMethod.stateMutability === 'payable' ? (
          <Field gap='5px'>
            <Text size='small'>
              payableAmount <span>ONE</span>
            </Text>
            <SmallTextInput
              value={amount}
              placeholder={`payableAmount (ONE)`}
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(evt.currentTarget.value)
              }
            />
          </Field>
        ) : null}
        {abiMethod.inputs && abiMethod.inputs.length ? (
          <Box gap='12px'>
            {abiMethod.inputs.map((input, idx) => {
              const name = input.name || '<input>';
              const isArrayValue = input.type.indexOf('[]') >= 0;
              const tabMethod = props.isRead ? 'read' : 'write';

              const itemValue = isArrayValue
                ? multipleValue[tabMethod][idx] || [{value: '', id: '1'}]
                : inputsValue[idx];

              const itemType = input.type.slice(0, input.type.indexOf('[]'));

              return (
                <Field gap='5px' key={idx}>
                  <Text size='small'>
                    {name} <span>({input.type})</span>
                  </Text>
                  {isArrayValue ? (
                    <Box direction={'column'}>
                      {itemValue.map(
                        (item: {id: string; value: string}, itemId: number) => {
                          return (
                            <Box
                              direction={'row'}
                              align={'center'}
                              margin={'small'}>
                              <Text style={{marginRight: '10px'}}>
                                {itemId}.
                              </Text>
                              <SmallTextInput
                                key={item.id}
                                value={item.value}
                                placeholder={`${itemType}`}
                                onChange={(
                                  evt: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  itemValue[itemId].value =
                                    evt.currentTarget.value;

                                  setMultipleValue({
                                    ...multipleValue,
                                    [tabMethod]: {
                                      ...multipleValue[tabMethod],
                                      [idx]: itemValue,
                                    },
                                  });

                                  setInputValue(
                                    itemValue.map((t: any) => t.value),
                                    idx
                                  );
                                }}
                              />
                              {itemValue.length === 1 ? null : (
                                <ActionButton
                                  style={{marginLeft: '10px'}}
                                  onClick={() => {
                                    setMultipleValue({
                                      ...multipleValue,
                                      [tabMethod]: {
                                        ...multipleValue[tabMethod],
                                        [idx]: itemValue.filter(
                                          (removeItem: any) =>
                                            removeItem.id !== item.id
                                        ),
                                      },
                                    });
                                  }}>
                                  remove
                                </ActionButton>
                              )}
                            </Box>
                          );
                        }
                      )}
                      <ActionButton
                        style={{marginTop: '10px'}}
                        onClick={() => {
                          itemValue.push({value: '', id: uniqid()});

                          setMultipleValue({
                            ...multipleValue,
                            [tabMethod]: {
                              ...multipleValue[tabMethod],
                              [idx]: itemValue,
                            },
                          });
                        }}>
                        + add one more
                      </ActionButton>
                    </Box>
                  ) : (
                    <SmallTextInput
                      value={inputsValue[idx]}
                      placeholder={`${name} (${input.type})`}
                      onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                        setInputValue(evt.currentTarget.value, idx);
                      }}
                    />
                  )}
                </Field>
              );
            })}
          </Box>
        ) : null}

        {!result || abiMethod.inputs?.length || abiMethod.stateMutability !== 'view' ? (
          <Box width='100px' margin={{top: '20px', bottom: '18px'}}>
            {loading ? (
              <Spinner />
            ) : abiMethod.stateMutability === 'view' ? (
              <ActionButton onClick={query}>Query</ActionButton>
            ) : (
              <ActionButton
                disabled={!props.metamaskAddress || !props.validChainId}
                onClick={query}>
                Write
              </ActionButton>
            )}
          </Box>
        ) : null}

        {abiMethod.outputs
          ? abiMethod.outputs.map((input, idx) => {
            return (<AbiParam
              key={idx}
              readonly={true}
              type={input.type}
              name={input.name}
              value={result[idx]}
            />)
          })
          : null}

        {error && (
          <Text color='red' size='small' style={{marginTop: 5}}>
            {error}
          </Text>
        )}
      </Box>
    </ViewWrapper>
  );
};
