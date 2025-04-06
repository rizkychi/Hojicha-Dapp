import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { colors } from '../styles/colors';
import Hojicha from '../contracts/Hojicha.json';

const HOJICHA_CONTRACT_ADDRESS = "0x81Ae4bedfc15E67fd099471534b4864d8b9f8b6F";

export default function TokenList({ account }) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!account) return;
      
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          HOJICHA_CONTRACT_ADDRESS, 
          Hojicha.abi, 
          provider
        );
        
        // Ganti ini dengan cara mendapatkan token list dari contract Anda
        const tokenCount = 1; // Sesuaikan
        const tempTokens = [];
        
        for (let i = 0; i < tokenCount; i++) {
          tempTokens.push({
            address: "0x...", // Ganti dengan address token
            name: "Sample Token",
            symbol: "STK",
            supply: "1000000"
          });
        }
        
        setTokens(tempTokens);
      } catch (error) {
        console.log("Error fetch tokens:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTokens();
  }, [account]);

  if (loading) {
    return <Typography>Loading tokens...</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: colors.primary }}>
        Your Tokens
      </Typography>
      
      {tokens.length === 0 ? (
        <Typography>No tokens created yet.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {tokens.map((token, index) => (
            <Card key={index} sx={{ backgroundColor: colors.accent }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: colors.primary }}>
                  {token.name} ({token.symbol})
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Supply: {ethers.formatUnits(token.supply, 18)}
                </Typography>
                <Typography variant="body2" sx={{ 
                  mt: 1, 
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  wordBreak: 'break-all'
                }}>
                  {token.address}
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ 
                    mt: 2,
                    backgroundColor: colors.secondary,
                    '&:hover': { backgroundColor: colors.primary }
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}