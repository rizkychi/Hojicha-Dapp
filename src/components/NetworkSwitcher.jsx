import { Button, Typography } from '@mui/material';

export default function NetworkSwitcher() {
  return (
    <Button
      variant="contained"
      color="warning"
      onClick={() => {
        alert('Silakan switch network manual di MetaMask ke Tea Sepolia (Chain ID: 10218)');
      }}
    >
      Network: Tea Sepolia
    </Button>
  );
}