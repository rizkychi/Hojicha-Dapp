import { Link } from 'react-router-dom';
import { useState } from 'react';
import TokenCreator from '../components/TokenCreator';
import TokenList from '../components/TokenList';

export default function CreateToken({ account }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTokenCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-white">Create New Token</h1>
        <p className="text-blue-100 mt-2">
          Mint your custom tokens with unique parameters
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <TokenCreator account={account} onTokenCreated={handleTokenCreated} />
        <TokenList account={account} key={refreshKey} />
        <div className="mt-6 text-center">
          <Link 
            to="/dashboard" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            <i className="fas fa-home mr-2"></i> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}