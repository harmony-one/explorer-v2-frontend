import { Block } from "src/types";

const getLatency = (blocks: Block[]) => {
  const blocksTimestamp = blocks
    .map((b) => new Date(b.timestamp).getTime())
    .sort((a, b) => (a < b ? -1 : 1));

  const diffs = [];

  for (let i = blocksTimestamp.length - 1; i > 0; i--) {
    diffs.push(blocksTimestamp[i] - blocksTimestamp[i - 1]);
  }

  return diffs.reduce((acc, t) => acc + t, 0) / diffs.length / 1000;
};

export const calculateSecondPerBlocks = (
  all_blocks: Array<Block[]>
): number => {
  return (
    all_blocks.map(getLatency).reduce((acc, t) => acc + t, 0) /
    all_blocks.length
  );
};

export const calculateSecondsPerBlock = (
  all_blocks: Array<Block[]>
): number[] => {
  return all_blocks.map(getLatency);
};
