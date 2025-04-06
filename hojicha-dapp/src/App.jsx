import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { colors } from './styles/colors';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      default: colors.background,
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});

export default function App() {
  const [account, setAccount] = useState(null);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  // Ganti seluruh kode connectWallet dengan:
const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert('Silakan install MetaMask!');
      return;
    }
    
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    setAccount(accounts[0]);
    
    // Cek network tapi tidak otomatis switch
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x27ea') {
      alert('Silakan switch network ke Tea Sepolia (Chain ID: 10218) di MetaMask Anda');
    }
  } catch (error) {
    alert('Gagal connect wallet: ' + error.message);
  }
};

  useEffect(() => {
    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header account={account} setAccount={setAccount} connectWallet={connectWallet} />
        <Routes>
          <Route path="/" element={<Home connectWallet={connectWallet} />} />
          <Route path="/dashboard" element={<Dashboard account={account} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}