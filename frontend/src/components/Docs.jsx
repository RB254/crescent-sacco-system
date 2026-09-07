import { FileText } from 'lucide-react';

export default function Docs() {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 font-bold text-xl text-slate-900 border-b pb-4">
        <FileText className="w-6 h-6 text-amber-600" />
        <h2>System Documentation & Technical Brief Summary</h2>
      </div>

      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <h3 className="font-bold text-base text-slate-900">Project Overview</h3>
        <p>
          Crescent Takaful SACCO Member Management System built with React, Vite, Node.js/Express, and MongoDB.
        </p>

        <h3 className="font-bold text-base text-slate-900">Key Business Rules Implemented</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Member Savings Ledger:</strong> Each member maintains one savings ledger. Withdrawals exceeding current balance are restricted.</li>
          <li><strong>Loan Qualification:</strong> Loan requests capped at 3x current savings balance.</li>
          <li><strong>Interest Rate:</strong> 10% flat interest rate per annum with equal monthly repayment installments.</li>
        </ul>
      </div>
    </div>
  );
}