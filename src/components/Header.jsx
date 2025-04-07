import { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  AccountCircle, 
  ContentCopy,
  Check,
  SettingsEthernet
} from '@mui/icons-material';
import { colors } from '../styles/colors';

export default function Header({ account, connectWallet }) {
  const [currentNetwork, setCurrentNetwork] = useState('');
  const [addressCopied, setAddressCopied] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  const TEA_SEPOLIA = {
    chainId: '0x27EA',
    chainName: 'Tea Sepolia',
    nativeCurrency: {
      name: 'TEA',
      symbol: 'TEA',
      decimals: 18
    },
    rpcUrls: ['https://tea-sepolia.g.alchemy.com/public'],
    blockExplorerUrls: ['https://sepolia.tea.xyz/']
  };

  const connectWalletHandler = async () => {
    try {
      await connectWallet();
    } catch (error) {
      alert('Failed to connect wallet: ' + error.message);
    }
  };

  const checkNetwork = async () => {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    setCurrentNetwork(
      chainId === '0x27ea' ? 'Tea Sepolia' : `Other Network (ID: ${parseInt(chainId, 16)})`
    );
  };

  const switchToTeaSepolia = async () => {
    setSwitchingNetwork(true);
    try {
      try {
        // Coba switch dulu
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x27EA' }]
        });
      } catch (switchError) {
        // Jika network belum ditambahkan (error code 4902)
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [TEA_SEPOLIA]
          });
        } else {
          throw switchError;
        }
      }
      await checkNetwork();
    } catch (error) {
      console.error('Failed to switch network:', error);
      alert(`Failed to switch network: ${error.message}\n\nPlease switch to:\nNetwork: Tea Sepolia\nChain ID: 10218`);
    } finally {
      setSwitchingNetwork(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  useEffect(() => {
    if (account && window.ethereum) {
      checkNetwork();
      
      const handleChainChanged = (chainId) => {
        setCurrentNetwork(
          chainId === '0x27EA' ? 'Tea Sepolia' : `Other Network (ID: ${parseInt(chainId, 16)})`
        );
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  useEffect(() => {
    if (currentNetwork === 'Tea Sepolia' && window.location.pathname !== '/dashboard') {
      window.location.href = '/dashboard';
    }
  }, [currentNetwork]);

  return (
    <AppBar position="static" sx={{ backgroundColor: colors.primary }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hojicha DApp
        </Typography>
        
        {currentNetwork && (
          <Chip
            icon={<SettingsEthernet />}
            label={currentNetwork}
            color={currentNetwork === 'Tea Sepolia' ? 'success' : 'error'}
            variant="outlined"
            sx={{ mr: 2, color: 'white' }}
          />
        )}
        
        {account ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={addressCopied ? 'Copied!' : 'Copy Address'}>
              <Chip
                avatar={
                  <Avatar sx={{ bgcolor: colors.accent }}>
                    <AccountCircle />
                  </Avatar>
                }
                label={`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                onClick={copyAddress}
                deleteIcon={addressCopied ? <Check /> : <ContentCopy />}
                onDelete={copyAddress}
                variant="outlined"
                sx={{ color: 'white' }}
              />
            </Tooltip>
            
            <Button
              variant="contained"
              size="small"
              color={currentNetwork === 'Tea Sepolia' ? 'success' : 'warning'}
              onClick={switchToTeaSepolia}
              disabled={switchingNetwork}
              sx={{ ml: 1 }}
            >
              {switchingNetwork ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Switch Network'
              )}
            </Button>
          </Box>
        ) : (
          <Button 
            variant="contained" 
            onClick={connectWalletHandler}
            sx={{ 
              backgroundColor: colors.secondary,
              '&:hover': { backgroundColor: colors.accent }
            }}
          >
            Connect Wallet
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}