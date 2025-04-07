import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateToken from './pages/CreateToken';
import SendToken from './pages/SendToken';
import BatchSend from './pages/BatchSend';
import Header from './components/Header';

function App() {
  const [account, setAccount] = useState(null);
  const [validNetwork, setValidNetwork] = useState(false);

  // Cek koneksi wallet & network saat load
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await checkNetwork();
          }
        } catch (error) {
          console.error("Init error:", error);
        }
      }
    };
    init();
  }, []);

  const checkNetwork = async () => {
    try {
      if (!window.ethereum) {
        console.error('Ethereum provider not available');
        return false;
      }
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Current chainId:', chainId);
      
      const isValid = chainId === '0x27ea'; // Tea Sepolia
      setValidNetwork(isValid);
      return isValid;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        alert('Please switch to Tea Sepolia Network');
      }
    } catch (error) {
      console.error("Connect error:", error);
    }
  };

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      setInitializing(true);
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await checkNetwork();
          }
        } catch (error) {
          console.error("Init error:", error);
        }
      }
      setInitializing(false);
    };
    init();
  }, []);

  if (!window.ethereum) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          MetaMask Not Detected
        </h1>
        <p className="mb-4">
          Please install MetaMask to use this application.
        </p>
        <a 
          href="https://metamask.io/download.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header account={account} connectWallet={connectWallet} />
      <Routes>
        <Route path="/" element={
          account && validNetwork ? (
            <Dashboard account={account} />
          ) : (
            <Home 
              connectWallet={connectWallet} 
              isWrongNetwork={account && !validNetwork}
            />
          )
        } />
        <Route path="/dashboard" element={
          account && validNetwork ? (
            <Dashboard account={account} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/create-token" element={
          account && validNetwork ? (
            <CreateToken account={account} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/send-token" element={
          account && validNetwork ? (
            <SendToken account={account} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/batch-send" element={
          account && validNetwork ? (
            <BatchSend account={account} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;