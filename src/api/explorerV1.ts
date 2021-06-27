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
    `${process.env.REACT_APP_EXPLORER_V1_API_URL}/codeVerification`,
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

  return await response.json();
};

export const loadSourceCode = async (address: string): Promise<ISourceCode> => {
  const response = await fetch(
    `${process.env.REACT_APP_EXPLORER_V1_API_URL}/fetchContractCode?contractAddress=${address}`,
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

  // return {
  //   contractAddress: "one1shend7cl77j77cud0ga464xsqcq7kkveg7z88r",
  //   compiler: "0.4.26",
  //   optimizer: "No",
  //   optimizerTimes: "0",
  //   sourceCode:
  //     "pragma solidity ^0.4.17;contract Lottery {    address public manager;    address[] public players;    function Lottery() public {        manager = msg.sender;    }    function enter() public payable {        require(msg.value > 0.01 ether);        players.push(msg.sender);    }    function random() private view returns (uint256) {        return uint256(keccak256(block.difficulty, now, players));    }    function pickWinner() public restricted {        uint256 index = random() % players.length;        players[index].transfer(this.balance);        players = new address[](0);    }    modifier restricted() {        require(msg.sender == manager);        _;    }    function getPlayers() public view returns (address[]) {        return players;    }}",
  //   libraries: ["", "", "", "", ""],
  //   constructorArguments: "",
  //   chainType: "testnet",
  //   contractName: "Lottery",
  // };

  return await response.json();
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
