import Web3 from "web3";
import { Text } from "grommet";
import React from "react";
import { Address } from "../components/ui";
import { ByteCode, IHexSignature } from "../types";

const web3 = new Web3();

export const parseSuggestedMethod = (textSignature: string, data: string) => {
  if (!textSignature) {
    return;
  }

  const method = parseTextSignature(textSignature);

  if (!method) {
    return;
  }

  const abi = createABI(method.name, method.params, "function");
  try {
    const parsed = web3.eth.abi.decodeParameters(
      abi.inputs,
      "0x" + data.slice(10)
    );
    return {
      event: method,
      abi,
      parsed,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const parseSuggestedEvent = (
  textSignature: string,
  data: string,
  topics: string[]
): any => {
  if (!textSignature) {
    return;
  }

  const event = parseTextSignature(textSignature);

  if (!event) {
    return;
  }

  const abi = createABI(event.name, event.params, "event");
  if (abi.inputs.length) {
    try {
      const [topic0, ...restTopics] = topics;
      const parsed = web3.eth.abi.decodeLog(abi.inputs, data, restTopics);

      return {
        event,
        abi,
        parsed,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  }
};

const createABI = (
  name: string,
  params: string[],
  type: "event" | "function"
) => {
  const inputs = params.map((type, i) => ({
    name: `$${i}`,
    type,
    // todo ?
    indexed: type === "address",
  }));
  return {
    inputs,
    type,
    name,
  };
};

const parseTextSignature = (sig: string) => {
  try {
    const [name, ...rest] = sig.split("(");
    const params = rest.join("").split(")")[0].split(",");

    return {
      name,
      params,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export interface IDisplaySignatureProps {
  input?: string;
  signatures?: IHexSignature[];
}

export const DisplaySignatureMethod = (props: IDisplaySignatureProps) => {
  const { input, signatures } = props;
  if (!input || input.length < 3) {
    return <>No input</>;
  }
  const signature = signatures && signatures[0] && signatures[0].signature;
  if (!signature) {
    return <>—</>;
  }

  const { parsed, event, abi } =
    parseSuggestedMethod(signature, input) || {};

  return <DisplaySignature parsed={parsed} event={event} abi={abi} />;
};

// event
export const DisplaySignature = (props: any = {}) => {
  const { parsed, event, abi } = props;

  if (!parsed || !event || !abi) {
    return <>—</>;
  }
 

  return (
    <Text size={"small"}>
      {event.name}(
      <>
        {abi.inputs.map((input: any, i: number) => {
          return (
            <div style={{ alignItems: "center", display: "inline-flex" }}>
              <Text size="small" color="minorText">
                {input.type}
              </Text>
              :&nbsp;
              {input.type === "address" || input.type === "address[]" ? (
                Array.isArray(parsed[input.name]) ? (
                  parsed[input.name].map((a: any, i: number) => {
                    return (
                      <>
                        <Address key={a} address={a?.toLowerCase()} />
                        {i < parsed[input.name].length - 1 && ", "}
                      </>
                    );
                  })
                ) : parsed[input?.name?.toString()] ? (
                  <Address
                    address={parsed[input?.name?.toString()]?.toLowerCase()}
                  />
                ) : null
              ) : Array.isArray(parsed[input.name]) ? (
                parsed[input.name].join(", ")
              ) : parsed[input.name] ? (
                parsed[input.name]?.toString()
              ) : null}
              {i < abi.inputs.length - 1 ? ", " : null}
            </div>
          );
        })}
      </>
      )
    </Text>
  );
};

export const revertErrorMessage = (error: ByteCode) => {
  if (!error) {
    return null;
  }
  if (!error.startsWith("0x08c379a0")) {
    return null;
  }

  const s = error.slice(10);
  return web3.eth.abi.decodeParameter("string", s);
};
