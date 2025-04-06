import { Box } from '@mui/material';
import TokenCreator from '../components/TokenCreator';
import TokenList from '../components/TokenList';
import NetworkSwitcher from '../components/NetworkSwitcher';

export default function Dashboard({ account }) {
  return (
    <Box sx={{ p: 3 }}>
      {/* <NetworkSwitcher /> */}
      <TokenCreator account={account} />
      <TokenList account={account} />
    </Box>
  );
}