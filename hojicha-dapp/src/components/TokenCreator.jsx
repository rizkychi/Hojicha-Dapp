import { useState } from 'react';
import { ethers } from 'ethers';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { colors } from '../styles/colors';
import Hojicha from '../contracts/Hojicha.json';

const HOJICHA_CONTRACT_ADDRESS = "0x81Ae4bedfc15E67fd099471534b4864d8b9f8b6F";

export default function TokenCreator({ account }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');

  const createToken = async () => {
    if (!name || !symbol || !supply) {
      alert("Harap isi semua field!");
      return;
    }
  
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        HOJICHA_CONTRACT_ADDRESS,
        Hojicha.abi,
        signer
      );
      
      const tx = await contract.createToken(
        name,
        symbol,
        ethers.parseUnits(supply, 18)
      );
      
      await tx.wait();
      alert("Token berhasil dibuat!");
      setSuccess(true);
    } catch (error) {
      console.log("Error buat token:", error);
      alert("Gagal buat token: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: colors.background, 
      p: 4, 
      borderRadius: 2,
      boxShadow: 3
    }}>
      <Typography variant="h5" gutterBottom sx={{ color: colors.primary }}>
        Create New Token
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Token Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Token Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          fullWidth
        />
        <TextField
          label="Initial Supply"
          type="number"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          fullWidth
        />
        
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            onClick={createToken}
            disabled={!account || !name || !symbol || !supply}
            sx={{ 
              backgroundColor: colors.primary,
              '&:hover': { backgroundColor: colors.secondary }
            }}
          >
            Create Token
          </Button>
        )}
        
        {success && (
          <Typography sx={{ color: colors.success, mt: 2 }}>
            Token created successfully! Transaction Hash: {tokenAddress}
          </Typography>
        )}
      </Box>
    </Box>
  );
}