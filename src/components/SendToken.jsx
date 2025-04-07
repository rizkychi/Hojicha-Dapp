import { useState } from 'react';
import { ethers } from 'ethers';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  CircularProgress,
  Alert 
} from '@mui/material';

export default function SendToken({ account }) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendToken = async () => {
    if (!tokenAddress || !recipient || !amount) {
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
      
      // Send transaction
      const tx = await token.transfer(
        recipient,
        ethers.parseUnits(amount, 18)
      );
      
      await tx.wait();
      setSuccess(true);
      
    } catch (error) {
      console.error("Send token failed:", error);
      setError(`Failed to send token: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Send Token
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Token sent successfully!{' '}
          <a 
            href={`https://sepolia.tea.xyz/tx/${tx.hash}`} 
            target="_blank"
            rel="noopener noreferrer"
            style={{color: '#1976d2', textDecoration: 'underline'}}
          >
            View on Explorer
          </a>
        </Alert>
      )}

      <TextField
        label="Token Contract Address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />
      
      <Button
        variant="contained"
        onClick={sendToken}
        disabled={loading || !account}
        fullWidth
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Send Token'
        )}
      </Button>
    </Box>
  );
}