import React from "react";
import { Clock } from "grommet-icons";
import dayjs from "dayjs";
import {RelativeTimer} from "./RelativeTimer";

interface TimestampProps {
  timestamp: string;
  withRelative?: boolean;
}

// @ts-ignore
export const Timestamp = (props: TimestampProps) => {
  const  { timestamp, withRelative } = props;
  return (
    <span>
      <Clock size="small" />
      &nbsp;{dayjs(timestamp).format("YYYY-MM-DD, HH:mm:ss")}
      {withRelative && <span>, <RelativeTimer date={timestamp} /></span>}
    </span>
  );
};
