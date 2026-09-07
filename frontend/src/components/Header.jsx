import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, PiggyBank, CircleDollarSign, TestTube, FileText } from 'lucide-react';
import logo from '../assets/logo.jpg';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Members', path: '/members', icon: Users },
    { label: 'Savings', path: '/savings', icon: PiggyBank },
    { label: 'Loans', path: '/loans', icon: CircleDollarSign },
    { label: 'Tests', path: '/tests', icon: TestTube },
    { label: 'Docs', path: '/docs', icon: FileText },
  ];

  return (
    <header className="w-full">
      {/* Purple-to-Orange Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-amber-600 text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-white p-1 flex items-center justify-center border border-white/30 shadow-sm overflow-hidden">
            <img src={logo} alt="Crescent Takaful SACCO Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight leading-snug">
              Crescent Takaful SACCO – Member Management System
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 font-light">
              Savings accounts, ledger transactions & flat-rate loan scheduling
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Touch-scrollable on mobile */}
      <div className="bg-slate-200/60 border-b border-slate-300 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}