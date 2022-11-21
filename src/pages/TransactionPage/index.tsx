import { TransactionDetails } from "src/components/transaction/TransactionDetails";
import { InternalTransactionList } from "src/components/transaction/InternalTransactionList";
import { TransactionLogs } from "src/components/transaction/TransactionLogs";
import { IHexSignature, InternalTransaction, RPCTransactionHarmony } from "src/types";
import { BaseContainer, BasePage } from "src/components/ui";

import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Text, Box, Spinner, Heading } from "grommet";
import {
  getInternalTransactionsByField,
  getTransactionByField,
  getTransactionLogsByField,
  getByteCodeSignatureByHash,
} from "src/api/client";
import { revertErrorMessage } from "src/web3/parseByteCode";
import { hmyv2_getTransactionReceipt } from "src/api/rpc";
import useQuery from "../../hooks/useQuery";
import { config } from "../../config";

const extractError = (err: any) => {
  const errorMessages = err!.split(":");
  if (errorMessages[1]) {
    const errorMessage = revertErrorMessage(errorMessages[1]);
    return errorMessage || err;
  }

  const errorMessage = revertErrorMessage(err);
  return errorMessage || err;
};

export const TransactionPage = () => {
  const history = useHistory();
  const { id } = useParams<{id: string}>();
  const query = useQuery();
  const activeTab = query.get('activeTab') || '0';

  // hash or number
  const [tx, setTx] = useState<RPCTransactionHarmony>({} as RPCTransactionHarmony);
  const [trxs, setTrxs] = useState<InternalTransaction[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txrsLoading, setTxrsLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState(+activeTab);
  const [inputSignature, setInputSignature] = useState<IHexSignature>()

  const { availableShards } = config

  useEffect(() => {
    const getTxInputSignature = async (trx: RPCTransactionHarmony) => {
      let signature
      try {
        const signatures = await getByteCodeSignatureByHash([trx.input.slice(0, 10)])
        if(signatures && signatures.length > 0) {
          signature = signatures[0]
        }
      } catch (e) {
        console.error('Cannot get tx input signature: ', (e as Error).message)
      }
      return signature
    }

    const getTx = async () => {
      let trx;
      let trxInputSignature;
      let shard = 0;
      if (id.length === 66) {
        trx = await getTransactionByField([0, "hash", id]);
      }

      if (!trx && availableShards.find((i) => i === 1)) {
        trx = await getTransactionByField([1, "hash", id]);
        shard = 1;
      }

      if (!trx && availableShards.find((i) => i === 2)) {
        trx = await getTransactionByField([2, "hash", id]);
        shard = 2;
      }

      if (!trx && availableShards.find((i) => i === 3)) {
        trx = await getTransactionByField([3, "hash", id]);
        shard = 3;
      }

      if (trx) {
        const txnReceipt = await hmyv2_getTransactionReceipt([id], shard);
        if (txnReceipt && txnReceipt.result && txnReceipt.result.gasUsed) {
          trx.gasLimit = trx.gas
          trx.gas = parseInt(txnReceipt.result.gasUsed).toString();
        }
        if (trx.input && trx.input.length > 10) {
          trxInputSignature = await getTxInputSignature(trx)
        }
      }

      setTx((trx || {}) as RPCTransactionHarmony);
      setInputSignature(trxInputSignature)
    };

    getTx();
  }, [id]);

  useEffect(() => {
    const getInternalTxs = async () => {
      if (tx.hash && tx.shardID === 0) {
        try {
          //@ts-ignore
          const txs = await getInternalTransactionsByField([
            0,
            "transaction_hash",
            tx.hash,
          ],
          // need to track fallback
          tx.blockNumber
        );
          const methodSignatures = await Promise.all(
            txs.map((tx) => {
              return tx.input && tx.input.length > 10
                ? getByteCodeSignatureByHash([tx.input.slice(0, 10)])
                : Promise.resolve([]);
            })
          );

          const txsWithSignatures = txs.map((l, i) => ({
            ...l,
            signatures: methodSignatures[i],
          }));

          setTrxs(txsWithSignatures as InternalTransaction[]);
          setTxrsLoading(false);
        } catch (err) {
          console.log(err);
        }
      } else {
        setTrxs([]);
      }
    };

    getInternalTxs();
  }, [tx.hash]);

  useEffect(() => {
    const getLogs = async () => {
      if (tx.hash && tx.shardID === 0) {
        try {
          //@ts-ignore
          const logs: any[] = await getTransactionLogsByField([
            0,
            "transaction_hash",
            tx.hash,
          ]);

          const logsSignatures = await Promise.all(
            logs.map((l) => getByteCodeSignatureByHash([l.topics[0]]))
          );

          const logsWithSignatures = logs.map((l, i) => ({
            ...l,
            signatures: logsSignatures[i],
          }));

          setLogs(logsWithSignatures as any);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
        }
      } else {
        setLogs([]);
      }
    };

    getLogs();
  }, [tx]);

  if (isLoading) {
    return (
      <Box style={{ height: "700px" }} justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <BaseContainer pad={{ horizontal: "0" }}>
      <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
        Transaction
      </Heading>
      <BasePage>
        <Tabs
          alignControls="start"
          justify="start"
          activeIndex={activeIndex}
          onActive={(newActive) => {
            if (newActive !== activeIndex) {
              history.replace(
                `${history.location.pathname}?activeTab=${newActive}`
              );
              setActiveIndex(newActive);
            }
          }}
        >
          <Tab title={<Text size="small">Transaction Details</Text>}>
            <TransactionDetails
              transaction={tx}
              logs={logs}
              internalTxs={trxs}
              inputSignature={inputSignature}
              errorMsg={
                txrsLoading
                  ? undefined
                  : trxs.length
                  ? trxs
                      .map((t) => t.error)
                      .filter((_) => _)
                      .map(extractError)
                      .join(",")
                  : ""
              }
            />
          </Tab>
          {trxs.length ? (
            <Tab
              title={
                <Text size="small">Internal Transactions ({trxs.length})</Text>
              }
            >
              <InternalTransactionList
                list={trxs}
                hash={tx.hash}
                timestamp={tx.timestamp}
              />
            </Tab>
          ) : null}
          {logs.length ? (
            <Tab title={<Text size="small">Logs ({logs.length})</Text>}>
              <TransactionLogs logs={logs} hash={tx.hash} />
            </Tab>
          ) : null}
        </Tabs>
      </BasePage>
    </BaseContainer>
  );
};
