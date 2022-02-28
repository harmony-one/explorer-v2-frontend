import { Box, Text } from "grommet";

export function ApprovalsHeader() {
  return (
    <Box margin={{ left: "10px" }}>
        <Text size="small" color={"minorText"}>
          This tool will check your wallet for any token approvals and guide you on how to revoke these approvals. To begin, please click the Sign In Metamask button.
        </Text>
        <Text size="small" color={"minorText"}>
          During periods of network congestion, it may take some time for the updated approval to be reflected in this tool.
        </Text>
        <Text size="small" color={"red"} margin={"medium"}>
          <b>NOTE:</b> approvals are required for dApps to function properly. <strong>Use this tool at your own risk.</strong> For more information, check out the Knowledge Base.
        </Text>
      </Box>
  );
}
