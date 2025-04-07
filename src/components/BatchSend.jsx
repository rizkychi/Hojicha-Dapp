import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material';
import HojichaABI from '../contracts/Hojicha.json';

export default function BatchSend({ account, userTokens }) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [recipientAddresses, setRecipientAddresses] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userTokens.length > 0 && !useCustomAddress) {
      setTokenAddress(userTokens[0].tokenAddress);
    }
  }, [userTokens, useCustomAddress]);

  const handleTokenAddressChange = (event) => {
    if (useCustomAddress) {
      setCustomAddress(event.target.value);
    } else {
      setTokenAddress(event.target.value);
    }
  };

  const sendBatch = async () => {
    const addressToUse = useCustomAddress ? customAddress : tokenAddress;

    if (!addressToUse || !recipientAddresses || !amount) {
      setError('Please fill in all fields!');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        addressToUse,
        HojichaABI.abi,
        signer
      );

      const addresses = recipientAddresses.split('\n').filter(addr => addr);
      const amounts = Array(addresses.length).fill(ethers.parseUnits(amount, 18));

      const tx = await contract.batchTransferToken(addressToUse, addresses, amounts);
      await tx.wait();

      setSuccess(true);
      setRecipientAddresses('');
      setAmount('');

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

      <FormControlLabel
        control={
          <Switch
            checked={useCustomAddress}
            onChange={(e) => setUseCustomAddress(e.target.checked)}
          />
        }
        label="Use Custom Token Address"
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="token-address-label">Token Address</InputLabel>
        {useCustomAddress ? (
          <TextField
            label="Custom Token Address"
            value={customAddress}
            onChange={handleTokenAddressChange}
            fullWidth
          />
        ) : (
          <Select
            labelId="token-address-label"
            value={tokenAddress}
            onChange={handleTokenAddressChange}
          >
            {userTokens.map((token) => (
              <MenuItem key={token.tokenAddress} value={token.tokenAddress}>
                {`${token.name} (${token.tokenAddress})`}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>

      <TextField
        label="Recipient Addresses (one per line)"
        value={recipientAddresses}
        onChange={(e) => setRecipientAddresses(e.target.value)}
        fullWidth
        multiline
        rows={5}
        sx={{ mb: 3 }}
        placeholder="Enter one address per line"
      />

      <TextField
        label="Amount (same for all addresses)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        onClick={sendBatch}
        disabled={loading || !account}
        fullWidth
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Send Batch'
        )}
      </Button>
    </Box>
  );
}