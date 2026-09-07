import { useState, useEffect } from 'react';
import { PiggyBank, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import API from '../api/axios';

export default function Savings() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [balance, setBalance] = useState(0);
  const [type, setType] = useState('DEPOSIT');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      fetchMemberSavings(selectedMember);
      fetchMemberTransactions(selectedMember);
    }
  }, [selectedMember]);

  const fetchMembers = async () => {
    try {
      const res = await API.get('/members');
      const memberList = Array.isArray(res.data) ? res.data : [];
      setMembers(memberList);
      if (memberList.length > 0) {
        // Ensure we extract the exact ID property from Mongo
        const firstId = memberList[0]._id || memberList[0].id;
        setSelectedMember(firstId);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchMemberSavings = async (memberId) => {
    try {
      const res = await API.get(`/savings/${memberId}`);
      setBalance(res.data?.balance || 0);
    } catch (err) {
      setBalance(0);
    }
  };

  const fetchMemberTransactions = async (memberId) => {
    try {
      const res = await API.get(`/ledger/member/${memberId}`);
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setTransactions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return setError('Please enter a valid positive amount.');
    }

    if (!selectedMember) {
      return setError('Please select a valid member.');
    }

    if (type === 'WITHDRAWAL' && parsedAmount > balance) {
      return setError('Insufficient funds for this withdrawal.');
    }

    try {
      setLoading(true);
      
      // POST request with verified payload
      await API.post('/savings/transaction', {
        memberId: selectedMember,
        type,
        amount: parsedAmount,
      });

      setAmount('');
      fetchMemberSavings(selectedMember);
      fetchMemberTransactions(selectedMember);
    } catch (err) {
      // Show exact server error message if available
      setError(err.response?.data?.message || 'Failed to post transaction.');
    } finally {
      setLoading(false);
    }
  };

  const formatKES = (val) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <div className="flex items-center gap-2 mb-4 font-bold text-lg text-slate-900">
          <PiggyBank className="w-5 h-5 text-emerald-600" />
          <h2>Post Savings Ledger</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Select Member</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              {members.length === 0 ? (
                <option value="">No members found</option>
              ) : (
                members.map((m) => {
                  const memberId = m._id || m.id;
                  return (
                    <option key={memberId} value={memberId}>
                      {m.fullName || m.name || 'Unnamed Member'}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('DEPOSIT')}
                className={`py-2 px-3 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1 ${
                  type === 'DEPOSIT'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" /> Deposit (+)
              </button>
              <button
                type="button"
                onClick={() => setType('WITHDRAWAL')}
                className={`py-2 px-3 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1 ${
                  type === 'WITHDRAWAL'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" /> Withdrawal (-)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (KES)</label>
            <input
              type="number"
              required
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedMember}
            className="w-full py-2.5 bg-gradient-to-r from-purple-800 to-amber-600 text-white font-semibold rounded-lg shadow hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Submit Transaction'}
          </button>
        </form>
      </div>

      {/* Ledger & Balance Display */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Available Savings Balance</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{formatKES(balance)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Transaction History Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-400 italic">
                      No savings transactions recorded for this member.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-xs">{new Date(tx.createdAt || tx.date).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                            tx.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          tx.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {tx.type === 'DEPOSIT' ? '+' : '-'}{formatKES(tx.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}