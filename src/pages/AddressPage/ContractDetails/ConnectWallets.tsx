import { useCallback, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Box, Text } from "grommet";
import { ActionButton } from "./AbiMethodView";

export const Wallet = (params: {
  onSetMetamask: (v: string) => void;
  onSetChainId: (chainId: number) => void;
}) => {
  const [metamaskAddress, setMetamask] = useState("");
  const [chainId, setChainId] = useState(0);

  useEffect(() => {
    params.onSetMetamask(metamaskAddress);
  }, [metamaskAddress]);

  useEffect(() => {
    params.onSetChainId(chainId);
  }, [chainId]);

  const signInMetamask = useCallback(() => {
    detectEthereumProvider().then((provider: any) => {
      try {
        // @ts-ignore
        if (provider !== window.ethereum) {
          console.error("Do you have multiple wallets installed?");
        }

        if (!provider) {
          alert("Metamask not found");
        }

        provider
          .request({ method: "eth_chainId" })
          .then((chainId: string) => {
            setChainId(parseInt(chainId, 16));
          })
          .catch((error: any) => {
            console.error(
              `Error fetching chainId: ${error.code}: ${error.message}`
            );
          });

        provider.on("chainIdChanged", (chainId: string) =>
          setChainId(parseInt(chainId, 16))
        );
        provider.on("chainChanged", (chainId: string) =>
          setChainId(parseInt(chainId, 16))
        );
        provider.on("networkChanged", (chainId: string) =>
          setChainId(parseInt(chainId, 16))
        );

        provider.on("accountsChanged", (accounts: string[]) =>
          setMetamask(accounts[0])
        );

        provider.on("disconnect", () => {
          setMetamask("");
        });

        provider
          .request({ method: "eth_requestAccounts" })
          .then(async (accounts: string[]) => {
            setMetamask(accounts[0]);
          });
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

  const isMainNet =
    process.env.REACT_APP_RPC_URL_SHARD0 === "https://api.s0.t.hmny.io/";

  const validChainId = isMainNet
    ? chainId === 1666600000
    : chainId === 1666700000;

  return (
    <Box margin={{ bottom: "medium" }}>
      {metamaskAddress ? (
        validChainId ? (
          <Text size="small">User address: {metamaskAddress}</Text>
        ) : (
          <Box direction={"column"}>
            <Text size="small" color="errorText">
              Selected Metamask wallet network is unsupported. Please switch
              network to Harmony {isMainNet ? "Mainnet" : "Testnet"}
            </Text>
            <ActionButton
              style={{ width: "250px" }}
              margin={{ top: "small" }}
              onClick={() =>
                window.open(
                  "https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet",
                  "_blank"
                )
              }
            >
              Readme Harmony Metamask setup
            </ActionButton>
          </Box>
        )
      ) : (
        <Box width="200px">
          <ActionButton onClick={signInMetamask}>Sign in Metamask</ActionButton>
        </Box>
      )}
    </Box>
  );
};
