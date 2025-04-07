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
import Hojicha from '../contracts/Hojicha.json';

const HOJICHA_CONTRACT_ADDRESS = "0xBf27B69449cCc28C8DDb92CbAc3Ce4290C4C3975";

export default function TokenCreator({ account, onTokenCreated }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  const createToken = async () => {
    if (!name || !symbol || !supply) {
      setError('Please fill in all fields!');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 1. Setup provider dan signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // 2. Load contract dengan ABI yang benar
      const contract = new ethers.Contract(
        HOJICHA_CONTRACT_ADDRESS,
        Hojicha.abi,
        signer
      );
      
      // 3. Kirim transaksi
      const tx = await contract.createToken(
        name,
        symbol,
        ethers.parseUnits(supply, 18)
      );
      
      // 4. Tunggu konfirmasi
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      setSuccess(true);
      
    } catch (error) {
      console.error("Full error object:", error);
      
      // Handle error spesifik
      let errorMessage = error.message;
      
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }
      
      setError(`Create token failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create New Token
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Token created successfully! TX Hash: {txHash}
        </Alert>
      )}

      <TextField
        label="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="Token Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="Initial Supply"
        type="number"
        value={supply}
        onChange={(e) => setSupply(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />
      
      <Button
        variant="contained"
        onClick={createToken}
        disabled={loading || !account}
        fullWidth
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Create Token'
        )}
      </Button>
    </Box>
  );
}