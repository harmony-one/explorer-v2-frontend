import { Box, ColumnConfig, Spinner, Text, Tip } from "grommet";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { TransactionsTable } from "src/components/tables/TransactionsTable";
import { Filter, IHexSignature, LogDetailed } from "src/types";
import {
  getByteCodeSignatureByHash,
  getDetailedTransactionLogsByField
} from "../../../../api/client";
import styled from "styled-components";
import { DisplaySignature, parseSuggestedEvent } from "../../../../web3/parseByteCode";

const TopicsContainer = styled.div`
  text-align: left;
`

const TextEllipsis = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const LinkText = styled(TextEllipsis)`
  color: ${props => props.theme.global.colors.brand};
`

const NeutralMarker = styled(Box)`
  border-radius: 2px;
  padding: 5px;

  text-align: center;
  font-weight: bold;
`;

const EventsBox = styled(Box)`
  padding: 10px;
  font-size: small;

  table tbody td {
    vertical-align: top;
  }
`

const CenteredContainer = styled.div`
  padding: 32px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`

function TxsHashColumn (props: { log: LogWithSignature }) {
  const { log } = props
  return <div style={{ width: '140px' }}>
    <Tip content={'Txn Hash'}>
      <Link to={`/tx/${log.transactionHash}`}>
        <LinkText>{log.transactionHash}</LinkText>
      </Link>
    </Tip>
    <Tip content={'Block number'}>
      <div style={{ display: 'flex' }}>
        #&nbsp;
        <Link to={`/block/${log.blockNumber}`} style={{ display: 'inline-block' }}>
          <LinkText>{log.blockNumber}</LinkText>
        </Link>
      </div>
    </Tip>
    {log.timestamp &&
      <Tip content={dayjs(log.timestamp).format('MMM-DD-YYYY hh:mm:ss a') }>
        <span>{dayjs(log.timestamp).fromNow()}</span>
      </Tip>
    }
  </div>
}

function TxMethod (props: { log: LogWithSignature }) {
  return <div style={{ width: '100px' }}>
    <Text size="12px">
      <Tip content={'MethodId'}>
        <NeutralMarker background={"backgroundBack"}>
          <TextEllipsis>{props.log.input.slice(0, 10)}</TextEllipsis>
        </NeutralMarker>
      </Tip>
    </Text>
  </div>
}

const Topic = styled(TextEllipsis)<{ isMarked: boolean }>`
  opacity: ${(props) => props.isMarked ? 0.6 : 1};
`

function Topics (props: { log: LogWithSignature }) {
  const { log } = props
  const { topics, data, signatures } = log
  let parsedEvents
  try {
    parsedEvents = signatures.map(s => s.signature).map(s => parseSuggestedEvent(s, data, topics))
  } catch (err) {
  }

  const displaySignature = parsedEvents && parsedEvents[0] && DisplaySignature(parsedEvents[0]) || null
  return <TopicsContainer>
    {displaySignature &&
      <div style={{ paddingBottom: '16px' }}>
        {displaySignature}
      </div>
    }
    {log.topics.map((topic, i) => {
      return <Topic key={`${topic}_${i}`} isMarked={i === 0 && displaySignature}>
        <Text size={'small'}>
          [topic{i}] {topic}
        </Text>
      </Topic>
    })}
  </TopicsContainer>
}

const getColumns = (): ColumnConfig<LogWithSignature>[] => {
  return [
    {
      property: "transactionHash",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "160px"}}
        >Txn Hash</Text>
      ),
      render: (data) => <TxsHashColumn log={data} />,
    },
    {
      property: "method",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "160px"}}
        >Method</Text>
      ),
      render: (data) => <TxMethod log={data} />,
    },
    {
      property: "topics",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300, textAlign: 'left' }}>
          Topics
        </Text>
      ),
      render: (data) => {
        return <Topics log={data} />
      },
    },
  ];
};

interface LogWithSignature extends LogDetailed {
  signatures: IHexSignature[]
}

export function EventsTab(props: {
  id: string;
}) {
  const limitValue = 10 // localStorage.getItem("tableLimitValue");

  const initFilter: Partial<Filter> = {
    offset: 0,
    limit: limitValue ? +limitValue : 10,
  };

  const [filter, setFilter] = useState<Filter>({
    ...(initFilter as any),
  });

  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<LogWithSignature[]>([])

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      const logs = await getDetailedTransactionLogsByField([
        0,
        "address",
        props.id,
        filter.limit,
        filter.offset
      ]);

      const logsSignatures = await Promise.all(
        logs.map((l: any) => {
          const firstTopicMethod = l.topics.length > 0 ? l.topics[0].slice(0, 10) : ''
          return getByteCodeSignatureByHash([firstTopicMethod])
        })
      )

      const logsWithSignatures = logs.map((l, i: number) => ({
        ...l,
        input: l.input || 'n/a',
        timestamp: l.timestamp || '',
        primaryKey: `${l.address}_${i}`, // key for grommet DataTable
        signatures: logsSignatures[i],
      }));

      setLogs(logsWithSignatures);
    } catch (e) {
      console.error('Cannot get logs for address', (e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [props.id])

  useEffect(() => {
    loadEvents()
  }, [filter.offset])

  return (
    <EventsBox>
      <TransactionsTable
        primaryKey={'primaryKey'}
        columns={getColumns()}
        filter={filter}
        hideCounter={true}
        setFilter={setFilter}
        limit={filter.limit || 10}
        data={logs}
        totalElements={logs.length}
        step={logs.length}
        noScrollTop
        minWidth="1266px"
        showPages={false}
        textType={"event"}
      />
    </EventsBox>
  );
}
