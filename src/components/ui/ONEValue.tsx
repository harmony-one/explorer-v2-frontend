import { useONEExchangeRate } from "../../hooks/useONEExchangeRate";
import { getNearestPriceForTimestamp } from "src/components/ONE_USDT_Rate";
import { Text, Box, Tip, Card, CardBody, Spinner } from "grommet";
import { TipContent } from "./Tooltip";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { formatNumber } from "./utils";
import { useClickOutside } from "../../hooks/useClickOutside";
import { getInternalTransactionsByField } from "../../api/client";
import { InternalTransaction } from "../../types";
import { Address } from "./Address";
import { FormNextLink } from "grommet-icons";
import styled from "styled-components";

interface ONEValueProps {
  value: string | number;
  timestamp?: string;
  hideTip?: boolean;
}

// @ts-ignore
export const ONEValue = (props: ONEValueProps) => {
  const { value, timestamp = "", hideTip = false } = props;
  const { lastPrice } = useONEExchangeRate();

  if (!value) {
    return null;
  }

  const isTodayTransaction =
    dayjs(timestamp).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
  const price =
    timestamp && !isTodayTransaction
      ? getNearestPriceForTimestamp(timestamp)
      : lastPrice;

  const bi = BigInt(value) / BigInt(10 ** 14);
  const v = parseInt(bi.toString()) / 10000;
  let USDValue = "";
  if (price && v > 0) {
    USDValue = (v * +price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currency: "USD",
    });
  }

  return (
    <Box direction="row" gap="xsmall">
      <Text
        weight={v > 0 ? "bold" : "normal"}
        size="small"
        margin={{ right: "xxmall" }}
      >
        {v.toString()} ONE
      </Text>
      {USDValue && +price > 0 && !isTodayTransaction && !hideTip && (
        <Tip
          dropProps={{ align: { left: "right" }, margin: { left: "small" } }}
          content={
            <TipContent
              message={
                <span>
                  {`Displaying value on ${dayjs(timestamp).format(
                    "YYYY-MM-DD"
                  )}. Current value`}{" "}
                  <b>
                    $
                    {formatNumber(v * +lastPrice, {
                      maximumFractionDigits: 2,
                    })}
                  </b>
                </span>
              }
            />
          }
          plain
        >
          <Text size="small">(${USDValue})</Text>
        </Tip>
      )}
      {USDValue && +price > 0 && isTodayTransaction && (
        <Text size="small">(${USDValue})</Text>
      )}
    </Box>
  );
};

const InternalValues = (props: { tx: any, isLoading: boolean, internalTxs: InternalTransaction[] }) => {
  const { tx, isLoading, internalTxs } = props
  return <Card background="backgroundTip" style={{ boxShadow: 'none' }}>
      <CardBody pad="medium">
        {isLoading &&
          <Box justify={'center'} align={'center'}>
            <Spinner />
          </Box>
        }
        {!isLoading && internalTxs.length === 0 &&
          <Box justify={'center'} align={'center'}>
            No internal transfers
          </Box>
        }
        {!isLoading && <Box gap={'8px'}>
          {internalTxs.length > 0 &&
            <Box>
              <Text size={'small'}>Internal values</Text>
            </Box>
          }
          <Box>
            {internalTxs
              .filter((internalTx, i) => +internalTx.value > 0)
              .map((internalTx) => {
                return <Box direction={'row'} style={{ fontSize: '8px' }}>
                  <ONEValue value={internalTx.value} timestamp={tx.timestamp} hideTip={true} />
                  &nbsp;
                  &nbsp;
                  <Address
                    isShort={true}
                    address={internalTx.from}
                    // hideCopyBtn={true}
                  />
                  <div>
                    <FormNextLink size="small" color="brand"/>
                  </div>
                  <Address
                    isShort={true}
                    address={internalTx.to}
                    // hideCopyBtn={true}
                  />
                </Box>
              })}
          </Box>
        </Box>}
      </CardBody>
    </Card>
}

export const ONEValueWithInternal = (props: ONEValueProps & { tx: any }) => {
  const [detailsOpened, setDetailsOpened] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [internalTxs, setInternalTxs] = useState<InternalTransaction[]>([])

  const clickRef = React.useRef() as React.RefObject<HTMLDivElement>;
  useClickOutside(clickRef, () => setDetailsOpened(false));

  useEffect(() => {
    const loadInternal = async () => {
      try {
        setLoading(true)
        const txs = await getInternalTransactionsByField([
          0,
          "transaction_hash",
          props.tx.hash,
        ]);
        setInternalTxs(txs)
      } catch (e) {

      } finally {
        setLoading(false)
      }
    }
    if(detailsOpened && internalTxs.length === 0) {
      loadInternal()
    }
  }, [detailsOpened])

  return <Box direction={'row'} gap={'8px'}>
    <Box>
      <ONEValue {...props} />
    </Box>
    {props.tx.hasInternalValues && +props.tx.value === 0 &&
      <Box ref={clickRef}>
        <Box onClick={() => setDetailsOpened(!detailsOpened)}>
          <Text size={'small'} color={'brand'} style={{ textDecoration: 'underline' }}>Show internal</Text>
        </Box>
          {detailsOpened &&
            <Box align={'center'}>
              <Box margin={{ top: '12px' }} style={{ position: 'absolute', minWidth: '260px' }}>
                <InternalValues tx={props.tx} isLoading={isLoading} internalTxs={internalTxs} />
              </Box>
            </Box>
          }
      </Box>
    }
  </Box>
}
