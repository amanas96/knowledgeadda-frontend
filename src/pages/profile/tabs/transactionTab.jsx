// pages/profile/tabs/TransactionsTab.jsx
import React from "react";

const TransactionsTab = ({ transactions, loadingTransactions }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-xl font-bold text-gray-800 mb-6">My Transactions</h3>
    {loadingTransactions ? (
      <p>Loading transactions...</p>
    ) : transactions.length === 0 ? (
      <p className="text-gray-500">No transactions found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-sm text-gray-500">Plan</th>
              <th className="p-3 text-sm text-gray-500">Amount</th>
              <th className="p-3 text-sm text-gray-500">Status</th>
              <th className="p-3 text-sm text-gray-500">Start</th>
              <th className="p-3 text-sm text-gray-500">End</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{tx.plan?.name}</td>
                <td className="p-3">₹{tx.plan?.price}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${tx.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(tx.startDate).toLocaleDateString()}
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(tx.endDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default TransactionsTab;
