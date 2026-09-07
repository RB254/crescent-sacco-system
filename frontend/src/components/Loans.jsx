import { useState, useEffect } from 'react';
import { CircleDollarSign, Calculator, AlertCircle, Calendar } from 'lucide-react';
import API from '../api/axios';

export default function Loans() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [principal, setPrincipal] = useState('');
  const [termMonths, setTermMonths] = useState(12);
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMember) fetchMemberSavings(selectedMember);
  }, [selectedMember]);

  const fetchMembers = async () => {
    try {
      const res = await API.get('/members');
      const memberList = Array.isArray(res.data) ? res.data : [];
      setMembers(memberList);
      if (memberList.length > 0) {
        setSelectedMember(memberList[0]._id || memberList[0].id);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchMemberSavings = async (memberId) => {
    try {
      const res = await API.get(`/savings/${memberId}`);
      setSavingsBalance(res.data?.balance || 0);
    } catch (err) {
      setSavingsBalance(0);
    }
  };

  const getMemberDisplayName = (m) => {
    if (m.fullName) return m.fullName;
    if (m.name) return m.name;
    if (m.memberName) return m.memberName;
    if (m.firstName) return `${m.firstName} ${m.lastName || ''}`.trim();
    return `Member (${(m._id || m.id || '').substring(0, 6)})`;
  };

  const calculateLoanSchedule = (e) => {
    e.preventDefault();
    setError('');

    const p = parseFloat(principal);
    const months = parseInt(termMonths, 10);
    const maxLoanLimit = savingsBalance * 3;

    if (isNaN(p) || p <= 0) return setError('Enter a valid loan amount.');
    if (isNaN(months) || months <= 0) return setError('Enter a valid term in months.');
    if (p > maxLoanLimit) {
      return setError(
        `Loan exceeds 3x savings limit! Maximum allowable loan for this member is Ksh ${maxLoanLimit.toLocaleString()}.`
      );
    }

    const annualRate = 0.10;
    const totalInterest = p * annualRate * (months / 12);
    const totalRepayable = p + totalInterest;
    const monthlyInstallment = totalRepayable / months;

    const installmentList = [];
    let remaining = totalRepayable;

    for (let i = 1; i <= months; i++) {
      remaining -= monthlyInstallment;
      installmentList.push({
        month: i,
        installment: monthlyInstallment,
        interestPortion: totalInterest / months,
        principalPortion: p / months,
        balance: Math.max(0, remaining),
      });
    }

    setSchedule({
      principal: p,
      totalInterest,
      totalRepayable,
      monthlyInstallment,
      months,
      installmentList,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <div className="flex items-center gap-2 mb-4 font-bold text-lg text-slate-900">
          <CircleDollarSign className="w-5 h-5 text-amber-600" />
          <h2>Loan Application Form</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={calculateLoanSchedule} className="space-y-4">
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
                  const mId = m._id || m.id;
                  return (
                    <option key={mId} value={mId}>
                      {getMemberDisplayName(m)}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
            <p><strong>Current Savings:</strong> Ksh {savingsBalance.toLocaleString()}</p>
            <p><strong>Max Loan Limit (3x):</strong> Ksh {(savingsBalance * 3).toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Loan Amount Requested (KES)</label>
            <input
              type="number"
              required
              placeholder="e.g. 15000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Repayment Term (Months)</label>
            <input
              type="number"
              min="1"
              max="60"
              required
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Interest Rate</label>
            <input
              type="text"
              disabled
              value="10% Flat Rate P.A."
              className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-purple-800 to-amber-600 text-white font-semibold rounded-lg shadow hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" /> Generate Repayment Schedule
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {!schedule ? (
          <div className="text-center py-20 text-slate-400 italic">
            Select a member and enter loan parameters to calculate schedule.
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-xs font-semibold text-purple-600">Principal</p>
                <p className="text-lg font-bold text-slate-900">Ksh {schedule.principal.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs font-semibold text-amber-600">Total Interest (10%)</p>
                <p className="text-lg font-bold text-slate-900">Ksh {schedule.totalInterest.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-600">Monthly Installment</p>
                <p className="text-lg font-bold text-slate-900">Ksh {schedule.monthlyInstallment.toFixed(2)}</p>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-700" /> Equal-Installment Repayment Schedule
            </h3>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-100 text-slate-800 font-semibold uppercase text-xs sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3">Installment</th>
                    <th className="py-2.5 px-3">Principal</th>
                    <th className="py-2.5 px-3">Interest</th>
                    <th className="py-2.5 px-3 text-right">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedule.installmentList.map((item) => (
                    <tr key={item.month} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold">Month {item.month}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">Ksh {item.installment.toFixed(2)}</td>
                      <td className="py-2.5 px-3">Ksh {item.principalPortion.toFixed(2)}</td>
                      <td className="py-2.5 px-3">Ksh {item.interestPortion.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-medium">Ksh {item.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}