import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
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
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const isValid = chainId === '0x27ea'; // Tea Sepolia
    setValidNetwork(isValid);
    return isValid;
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
        {/* Auto-redirect jika langsung akses /dashboard */}
        <Route path="/dashboard" element={
          account && validNetwork ? (
            <Dashboard account={account} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;