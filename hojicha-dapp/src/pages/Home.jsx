import { Box, Typography, Button } from '@mui/material';
import { colors } from '../styles/colors';
import { motion } from 'framer-motion';

export default function Home({ connectWallet }) {
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
          Welcome to Hojicha Token DApp
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
          onClick={connectWallet}
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
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Pastikan MetaMask sudah diset ke:
          <br />
          <strong>Network:</strong> Tea Sepolia
          <br />
          <strong>Chain ID:</strong> 10218
          <br />
          <strong>RPC URL:</strong> https://tea-sepolia.g.alchemy.com/public
        </Typography>
      </motion.div>
    </Box>
  );
}