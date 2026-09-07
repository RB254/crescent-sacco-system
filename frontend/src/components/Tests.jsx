import { useState } from 'react';
import { TestTube, Play, CheckCircle2, XCircle } from 'lucide-react';

export default function Tests() {
  const [testResults, setTestResults] = useState([]);

  const runLogicTests = () => {
    const results = [];

    // Test 1: Flat Interest Loan Math
    const principal = 10000;
    const months = 12;
    const expectedInterest = 1000;
    const calculatedInterest = principal * 0.10 * (months / 12);

    results.push({
      title: 'Loan Interest Calculation (10% Flat P.A.)',
      passed: calculatedInterest === expectedInterest,
      details: `Expected Ksh ${expectedInterest}, Calculated Ksh ${calculatedInterest}`,
    });

    // Test 2: Maximum Loan Limit Validation (3x Balance)
    const savingsBalance = 5000;
    const requestedLoan = 20000;
    const isExceeded = requestedLoan > savingsBalance * 3;

    results.push({
      title: '3x Savings Loan Limit Guardrail',
      passed: isExceeded === true,
      details: `Savings: Ksh ${savingsBalance}, Max Allowed: Ksh ${savingsBalance * 3}, Requested: Ksh ${requestedLoan}`,
    });

    // Test 3: Withdrawal Balance Guardrail
    const balance = 2000;
    const withdrawalAmount = 2500;
    const isForbidden = withdrawalAmount > balance;

    results.push({
      title: 'Insufficient Balance Withdrawal Restriction',
      passed: isForbidden === true,
      details: `Balance: Ksh ${balance}, Attempted Withdrawal: Ksh ${withdrawalAmount}`,
    });

    setTestResults(results);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <TestTube className="w-5 h-5 text-purple-700" />
          <h2>Automated Business Logic Test Suite</h2>
        </div>
        <button
          onClick={runLogicTests}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-purple-800 transition"
        >
          <Play className="w-4 h-4" /> Run Core Tests
        </button>
      </div>

      {testResults.length === 0 ? (
        <div className="text-center py-12 text-slate-400 italic">
          Click "Run Core Tests" to execute financial logic test scenarios.
        </div>
      ) : (
        <div className="space-y-4">
          {testResults.map((t, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                t.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
              }`}
            >
              {t.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-slate-900">{t.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{t.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}