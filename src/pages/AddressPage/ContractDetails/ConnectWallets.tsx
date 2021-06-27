import { useCallback, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Box, Button, Text } from "grommet";
import { ActionButton } from "./AbiMethodView";

export const Wallet = (params: { onSetMetamask: (v: string) => void }) => {
  const [metamaskAddress, setMetamask] = useState("");

  useEffect(() => {
    params.onSetMetamask(metamaskAddress);
  }, [metamaskAddress]);

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

  return (
    <Box margin={{ bottom: "medium" }}>
      {metamaskAddress ? (
        <Text size="small">User address: {metamaskAddress}</Text>
      ) : (
        <Box width="200px">
          <ActionButton onClick={signInMetamask}>Sign in Metamask</ActionButton>
        </Box>
      )}
    </Box>
  );
};
