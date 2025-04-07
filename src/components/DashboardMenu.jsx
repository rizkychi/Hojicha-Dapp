import { Link } from 'react-router-dom';

export default function DashboardMenu() {
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-white text-2xl font-bold mb-4">Token Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link 
          to="/create-token"
          className="bg-white/90 hover:bg-white transition-all p-4 rounded-lg flex flex-col items-center shadow-md"
        >
          <i className="fas fa-plus-circle text-3xl text-blue-600 mb-2"></i>
          <span className="text-blue-600">Create Token</span>
        </Link>
        <Link 
          to="/send-token"
          className="bg-white/90 hover:bg-white transition-all p-4 rounded-lg flex flex-col items-center shadow-md"
        >
          <i className="fas fa-paper-plane text-3xl text-green-600 mb-2"></i>
          <span className="text-green-600">Send Token</span>
        </Link>
        <Link 
          to="/batch-send"
          className="bg-white/90 hover:bg-white transition-all p-4 rounded-lg flex flex-col items-center shadow-md"
        >
          <i className="fas fa-th-large text-3xl text-yellow-600 mb-2"></i>
          <span className="text-yellow-600">Batch Send</span>
        </Link>
        <Link 
          to="/settings"
          className="bg-white/90 hover:bg-white transition-all p-4 rounded-lg flex flex-col items-center shadow-md"
        >
          <i className="fas fa-cog text-3xl text-red-600 mb-2"></i>
          <span className="text-red-600">Settings</span>
        </Link>
      </div>
    </div>
  );
}