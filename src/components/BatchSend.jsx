import { useState } from 'react';
import { ethers } from 'ethers';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

export default function BatchSend({ account }) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [transfers, setTransfers] = useState([{ address: '', amount: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addTransfer = () => {
    setTransfers([...transfers, { address: '', amount: '' }]);
  };

  const removeTransfer = (index) => {
    const newTransfers = [...transfers];
    newTransfers.splice(index, 1);
    setTransfers(newTransfers);
  };

  const updateTransfer = (index, field, value) => {
    const newTransfers = [...transfers];
    newTransfers[index][field] = value;
    setTransfers(newTransfers);
  };

  const sendBatch = async () => {
    if (!tokenAddress || transfers.some(t => !t.address || !t.amount)) {
      setError('Please fill in all fields!');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Load token contract
      const token = new ethers.Contract(
        tokenAddress,
        ['function transfer(address to, uint256 amount) returns (bool)'],
        signer
      );
      
      // Send all transfers
      for (const transfer of transfers) {
        const tx = await token.transfer(
          transfer.address,
          ethers.parseUnits(transfer.amount, 18)
        );
        await tx.wait();
      }
      
      setSuccess(true);
      
    } catch (error) {
      console.error("Batch send failed:", error);
      setError(`Failed to send batch: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Batch Send Tokens
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Batch transfer completed successfully!
        </Alert>
      )}

      <TextField
        label="Token Contract Address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />
      
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Recipient Address</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transfers.map((transfer, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    value={transfer.address}
                    onChange={(e) => updateTransfer(index, 'address', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={transfer.amount}
                    onChange={(e) => updateTransfer(index, 'amount', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => removeTransfer(index)}
                    disabled={transfers.length <= 1}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={addTransfer}
        >
          Add Recipient
        </Button>
        
        <Button
          variant="contained"
          onClick={sendBatch}
          disabled={loading || !account}
          sx={{ flexGrow: 1 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Send Batch'
          )}
        </Button>
      </Box>
    </Box>
  );
}