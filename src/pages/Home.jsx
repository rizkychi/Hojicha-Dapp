import { Box, Typography, Button } from '@mui/material';
import { colors } from '../styles/colors';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ connectWallet, isConnected }) {
  const navigate = useNavigate();

  // Handle redirect setelah koneksi berhasil
  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  // Fungsi wrapper untuk handle connect + error
  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      textAlign: 'center',
      p: 3
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h2" sx={{ 
          color: colors.primary, 
          mb: 3,
          fontWeight: 700
        }}>
          Welcome to Hojicha DApp
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography variant="h5" sx={{ 
          color: colors.text, 
          mb: 4,
          maxWidth: '800px'
        }}>
          Create and manage your custom tokens on the Tea Sepolia network
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button 
          variant="contained" 
          size="large"
          onClick={handleConnect}
          sx={{ 
            backgroundColor: colors.primary,
            '&:hover': { backgroundColor: colors.secondary },
            px: 4,
            py: 2,
            fontSize: '1.1rem'
          }}
        >
          Connect Wallet to Get Started
        </Button>
      </motion.div>
    </Box>
  );
}