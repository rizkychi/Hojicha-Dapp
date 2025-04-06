import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { 
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  OpenInNew as ExplorerIcon
} from '@mui/icons-material';
import { colors } from '../styles/colors';
import HojichaABI from '../contracts/Hojicha.json';

const HOJICHA_CONTRACT_ADDRESS = "0x81Ae4bedfc15E67fd099471534b4864d8b9f8b6F";

export default function TokenList({ account }) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!account || !window.ethereum) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          HOJICHA_CONTRACT_ADDRESS, 
          HojichaABI.abi, 
          provider
        );
        
        // Asumsi contract memiliki mapping atau array untuk menyimpan token
        // Contoh 1: Jika menggunakan mapping (creator => token address)
        // const tokenAddress = await contract.tokens(account);
        
        // Contoh 2: Jika menggunakan array
        const tokenCount = await contract.tokenCount();
        const tokenAddresses = [];
        for (let i = 0; i < tokenCount; i++) {
          tokenAddresses.push(await contract.tokenList(i));
        }

        // Jika mendapatkan single token address
        if (tokenAddress && tokenAddress !== ethers.ZeroAddress) {
          const tokenContract = new ethers.Contract(
            tokenAddress,
            [
              "function name() view returns (string)",
              "function symbol() view returns (string)",
              "function totalSupply() view returns (uint256)"
            ],
            provider
          );

          const [name, symbol, supply] = await Promise.all([
            tokenContract.name(),
            tokenContract.symbol(),
            tokenContract.totalSupply()
          ]);

          setTokens([{
            address: tokenAddress,
            name: name || "Unnamed Token",
            symbol: symbol || "TOKEN",
            supply: supply.toString()
          }]);
        } else {
          setTokens([]);
        }
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        setError(`Failed to load tokens: ${error.reason || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();

    // Refresh setiap 30 detik
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, [account]);

  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const openInExplorer = (address) => {
    window.open(`https://sepolia.tea.xyz/address/${address}`, '_blank');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (tokens.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
        You haven't created any tokens yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: colors.primary }}>
        Your Tokens
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        mt: 2
      }}>
        {tokens.map((token, index) => (
          <Card key={index} sx={{ 
            backgroundColor: colors.background,
            transition: 'transform 0.3s',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {token.name}
                </Typography>
                <Chip 
                  label={token.symbol} 
                  color="primary"
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                Total Supply: {ethers.formatUnits(token.supply, 18)}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Contract Address:
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mt: 0.5
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {token.address}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => copyToClipboard(token.address)}
                    sx={{ 
                      minWidth: '32px',
                      ml: 1,
                      color: copiedAddress === token.address ? colors.success : colors.primary
                    }}
                  >
                    {copiedAddress === token.address ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                  </Button>
                </Box>
              </Box>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ExplorerIcon />}
                onClick={() => openInExplorer(token.address)}
                sx={{ mt: 1 }}
              >
                View on Explorer
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}