import DashboardMenu from '../components/DashboardMenu';

export default function Dashboard({ account }) {
  return (
    <div className="p-6">
      <DashboardMenu />
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Hojicha DApp</h1>
        <p className="text-gray-600 mb-6">
          Manage your tokens efficiently with our powerful tools. Select an option from the menu above to get started.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Create Tokens</h3>
            <p className="text-blue-600">Mint new tokens with custom parameters</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Send Tokens</h3>
            <p className="text-green-600">Transfer tokens to other addresses</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Batch Operations</h3>
            <p className="text-purple-600">Send tokens to multiple addresses at once</p>
          </div>
        </div>
      </div>
    </div>
  );
}