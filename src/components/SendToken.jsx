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
import HojichaABI from '../contracts/Hojicha.json'; // Import ABI
import { HOJICHA_CONTRACT_ADDRESS } from '../constants';

export default function SendToken({ account, userTokens }) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [selectedTokenBalance, setSelectedTokenBalance] = useState(null);

  useEffect(() => {
    if (userTokens.length > 0 && !useCustomAddress) {
      setTokenAddress(userTokens[0].tokenAddress);
    }
  }, [userTokens, useCustomAddress]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (tokenAddress && !useCustomAddress) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(
            tokenAddress,
            HojichaABI, // Use ABI for fetching balance
            provider
          );
          const balance = await contract.balanceOf(account);
          setSelectedTokenBalance(ethers.formatUnits(balance, 18));
        } catch (error) {
          console.error('Error fetching token balance:', error);
          setSelectedTokenBalance(null);
        }
      } else {
        setSelectedTokenBalance(null);
      }
    };
    fetchBalance();
  }, [tokenAddress, useCustomAddress, account]);

  const handleTokenAddressChange = (event) => {
    if (useCustomAddress) {
      setCustomAddress(event.target.value);
    } else {
      setTokenAddress(event.target.value);
    }
  };

  const sendToken = async () => {
    const addressToUse = useCustomAddress ? customAddress : tokenAddress;

    if (!addressToUse || !recipient || !amount) {
      setError('Please fill in all fields!');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const token = new ethers.Contract(
        addressToUse,
        HojichaABI, // Use ABI for sending tokens
        signer
      );

      const tx = await token.transfer(
        recipient,
        ethers.parseUnits(amount, 18)
      );

      await tx.wait();
      setTxHash(tx.hash);
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
            href={`https://sepolia.tea.xyz/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'underline' }}
          >
            View on Explorer
          </a>
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

      {!useCustomAddress && selectedTokenBalance !== null && (
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Balance: {selectedTokenBalance}
        </Typography>
      )}

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