import { Link } from 'react-router-dom';
import SendToken from '../components/SendToken';

export default function SendTokenPage({ account }) {
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-white">Send Token</h1>
        <p className="text-green-100 mt-2">
          Transfer tokens to another address
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <SendToken account={account} />
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