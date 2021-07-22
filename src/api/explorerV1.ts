import { AbiItem } from "web3-utils";

export interface IVerifyContractData {
  contractAddress: string;
  compiler: string;
  optimizer: string;
  optimizerTimes: string;
  sourceCode: string;
  libraries: { value: string; id: string }[];
  constructorArguments: string;
  chainType: string;
  contractName: string;
  statusText: string;
  isLoading: boolean;
  error: string;
}

export interface IVerifyContractDataSendData {
  contractAddress: string;
  compiler: string;
  optimizer: string;
  optimizerTimes: string;
  sourceCode: string;
  libraries: string[];
  constructorArguments: string;
  chainType: string;
  contractName: string;
}

export const verifyContractCode = async (data: IVerifyContractDataSendData) => {
  const response = await fetch(
    `${process.env.VERIFICATION_API_URL}codeVerification`,
    {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    }
  );

  const body = await response.json();

  if (response.status !== 200) {
    throw new Error(body?.message);
  }

  return body;
};

export const loadSourceCode = async (address: string): Promise<ISourceCode> => {
  const response = await fetch(
    `${process.env.VERIFICATION_API_URL}fetchContractCode?contractAddress=${address}`,
    {
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }
  );

  const body = await response.json();

  if (response.status !== 200) {
    throw new Error(body);
  }

  return body;
};

export interface ISourceCode {
  contractAddress: string;
  compiler: string;
  optimizer: string;
  optimizerTimes: string;
  sourceCode: string;
  libraries: string[];
  constructorArguments: string;
  chainType: string;
  contractName: string;
  abi?: AbiItem[];
}
