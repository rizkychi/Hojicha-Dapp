import { Link } from 'react-router-dom';
import BatchSend from '../components/BatchSend';

export default function BatchSendPage({ account }) {
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-white">Batch Send Tokens</h1>
        <p className="text-purple-100 mt-2">
          Transfer tokens to multiple addresses at once
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <BatchSend account={account} />
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