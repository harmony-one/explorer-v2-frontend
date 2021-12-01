import React from "react";
import { Text } from "grommet";
import dayjs from "dayjs";
import { DateFormat, useDateFormatMode } from "../../hooks/dateFormatSwitcherHook";
import { RelativeTimer } from "./RelativeTimer";

interface IRelativeTimer {
  date: number | string | Date;
}

export function DateTime(props: IRelativeTimer) {
  const { date } = props;

  const dateFormat = useDateFormatMode();

  if (dateFormat === DateFormat.RELATIVE) {
    return <RelativeTimer date={date} />
  }

  const formattedDate = dayjs(date).format("MM/DD/YYYY, HH:mm:ss");

  return (
    <Text
      size="small"
      style={{ minWidth: "125px" }}
      color="minorText"
      title={formattedDate}
    >
      {formattedDate}
    </Text>
  );
}
