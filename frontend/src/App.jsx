import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Savings from './components/Savings';
import Loans from './components/Loans';
import Tests from './components/Tests';
import Docs from './components/Docs';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}