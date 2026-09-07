import { useState, useEffect } from 'react';
import { Users, PiggyBank, CircleDollarSign, TrendingUp, Activity } from 'lucide-react';
import API from '../api/axios';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalMembers: 0,
    totalSavings: 0,
  });
  const [topSavers, setTopSavers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  const fetchDashboardAnalytics = async () => {
    try {
      setLoading(true);
      const [membersRes, savingsRes, topSaversRes] = await Promise.all([
        API.get('/members').catch(() => ({ data: [] })),
        API.get('/savings/summary').catch(() => ({ data: { totalSavings: 0 } })),
        API.get('/savings/top-savers').catch(() => ({ data: [] })),
      ]);

      const membersList = Array.isArray(membersRes.data) ? membersRes.data : [];
      
      setMetrics({
        totalMembers: membersList.length,
        totalSavings: savingsRes.data?.totalSavings || 0,
      });

      setTopSavers(Array.isArray(topSaversRes.data) ? topSaversRes.data : []);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
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

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading SACCO System Summary...</div>;
  }

  return (
    <div className="space-y-8">
      {/* SACCO Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Active Members</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalMembers}</h3>
          </div>
          <div className="p-3 bg-purple-100 rounded-xl text-purple-800">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Savings Capital</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{formatKES(metrics.totalSavings)}</h3>
          </div>
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Max SACCO Loan Limit (3x)</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{formatKES(metrics.totalSavings * 3)}</h3>
          </div>
          <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
            <CircleDollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Loan Rate Standard</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">10.0% Flat</h3>
          </div>
          <div className="p-3 bg-blue-100 rounded-xl text-blue-700">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Breakdown & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-700" /> Top Savers Summary
            </h3>
            <span className="text-xs text-slate-400">Ranked by balance</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
                <tr>
                  <th className="py-2.5 px-3">Member Name</th>
                  <th className="py-2.5 px-3 text-right">Savings Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topSavers.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="py-8 text-center text-slate-400 italic">
                      No savings account data available yet.
                    </td>
                  </tr>
                ) : (
                  topSavers.map((saver, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{saver.fullName}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                        {formatKES(saver.balance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Overview Card */}
        <div className="bg-gradient-to-br from-purple-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Crescent Takaful SACCO</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Automated Member Management System governing financial savings accounts, ledger posts, and 3x collateralized loan repayments.
            </p>
            <div className="space-y-2 border-t border-slate-700/60 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Maximum Borrowing:</span>
                <span className="font-bold text-amber-400">3x Savings Balance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Interest Calculation:</span>
                <span className="font-bold text-emerald-400">10% Flat Rate P.A.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 text-[11px] text-slate-400 text-center">
            System Operational • Active Node
          </div>
        </div>
      </div>
    </div>
  );
}