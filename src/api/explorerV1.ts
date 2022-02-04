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
  argsLoading: boolean;
  error: string;
  tab: string;
  fileList?: File[];
  language: number;
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
  fileList?: File[],
  tab: string,

}

export const verifyContractCode = async (data: IVerifyContractDataSendData) => {
  
  if (data.tab === "Multiple Source Files") {
    console.log("Handling multiple files");
    const formData = new FormData();
    data.fileList?.forEach(file=>{
      formData.append(file.name, file);
    });

    for (const [k, v] of Object.entries(data)) {
      if (k === "fileList") {
        continue;
      }

      if (k === "language" && +v === 0) {
        continue;
      }
      
      if (k === "libraries") {
        formData.append(k, v.join(","));
      }
      else {
        formData.append(k, v);
      }
    }

    const response = await  fetch(
      `${process.env.REACT_APP_EXPLORER_V1_API_URL}codeVerification`,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: formData,
      }
    );

    const body = await response.json();

    console.log("Handling multiple files", body);

    if (response.status !== 200) {
      throw new Error(body?.message);
    }

    return body;
  }
  else {
    const response = await fetch(
      `${process.env.REACT_APP_EXPLORER_V1_API_URL}codeVerification`,
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
  }
};

export const loadSourceCode = async (address: string): Promise<ISourceCode> => {
  const response = await fetch(
    `${process.env.REACT_APP_EXPLORER_V1_API_URL}fetchContractCode?contractAddress=${address}`,
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
  supporting: any;
  libraries: string[];
  constructorArguments: string;
  chainType: string;
  contractName: string;
  abi?: AbiItem[];
  proxyAddress?: string;
  proxyDetails?: any;
  proxy?: any;
}
