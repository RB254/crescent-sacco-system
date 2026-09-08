import React, { useState, useEffect } from 'react';

// Relative path fallback allows fetch to automatically use the current origin
const API_BASE_URL = '';

const TransactionHistory = ({ memberId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!memberId) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/savings/transactions/${memberId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load history');
        }

        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [memberId]);

  if (loading) return <p className="text-gray-500 py-4">Loading transaction history...</p>;
  if (error) return <p className="text-red-500 py-4">{error}</p>;

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent transactions recorded for this member.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        tx.type === 'DEPOSIT'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">
                    {tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;