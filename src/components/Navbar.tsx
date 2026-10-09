import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Upload,
  User as UserIcon,
  LogOut,
  Shield,
  Bookmark,
  Menu,
  Globe,
  Coins,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenAuth: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenAuth,
  onToggleSidebar,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'AM' | 'OM'>('EN');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('discovery', searchQuery.trim());
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  const userInitial = user?.profile?.fullName
    ? user.profile.fullName[0].toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : 'U';

  const userFirstName = user?.profile?.fullName
    ? user.profile.fullName.split(' ')[0]
    : user?.email
    ? user.email.split('@')[0]
    : 'Scholar';

  const walletBalance = user?.wallet?.balanceCredits ?? 110;
  const verifiedStatus = user?.profile?.verifiedStatus || 'UNVERIFIED';

  return (
    <header className="sticky top-0 z-40 bg-[#0B192C]/95 backdrop-blur-md border-b border-slate-700/60 shadow-lg shadow-black/15 transition-all">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* 1. Sidebar Toggle & Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 transition-colors shadow-xs group"
              title="Toggle Navigation Sidebar"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            </button>

            <div
              className="flex items-center gap-2 cursor-pointer select-none group"
              onClick={() => onNavigate('home')}
              title="Gootiraa Research Hub — Home"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-900/40 ring-1 ring-white/10 group-hover:scale-105 transition-transform shrink-0">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-base sm:text-xl font-black tracking-tight text-white group-hover:text-teal-200 transition-colors">
                    GOOTIRAA
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold tracking-wider">
                    Hub
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-normal font-sans hidden md:block leading-tight mt-0.5">
                  Scholarly Repository & Open Science
                </p>
              </div>
            </div>
          </div>

          {/* 2. Global Unified Search Bar (Spacious Center) */}
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center flex-1 max-w-sm md:max-w-md lg:max-w-xl mx-1 sm:mx-3 transition-all duration-200 ${
              searchFocused ? 'max-w-md md:max-w-lg lg:max-w-2xl' : ''
            }`}
          >
            <div className="relative w-full group">
              <Search
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  searchFocused ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-300'
                }`}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search papers, DOIs, scholars, topics..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#132A45]/90 hover:bg-[#183556] focus:bg-[#132A45] text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-9 pr-12 sm:pr-14 py-2 border border-slate-700/80 focus:border-teal-500/80 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-inner transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none">
                <kbd className="text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 px-1.5 py-0.5 rounded shadow-xs">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </form>

          {/* 3. Right Utility Section */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Language Switcher Pill */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLang(lang === 'EN' ? 'AM' : lang === 'AM' ? 'OM' : 'EN')}
                className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-700/80 transition-colors shadow-xs"
                title="Switch Interface Language (EN / አማ / Oro)"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="font-medium whitespace-nowrap">
                  {lang === 'EN' ? 'EN' : lang === 'AM' ? 'አማ' : 'Oro'}
                </span>
              </button>
            </div>

            {/* Live Research Credits Indicator (Authenticated) */}
            {isAuthenticated && (
              <button
                onClick={() => onNavigate('profile', user?.id)}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 sm:px-2.5 py-1.5 rounded-xl flex items-center gap-1 sm:gap-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer group shrink-0"
                title="Your Research Impact Credits (RC) balance. Click to view wallet & patronage."
              >
                <Coins className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span className="font-mono text-[11px] sm:text-xs">{walletBalance}</span>
                <span className="text-[10px] text-amber-400/80 hidden sm:inline">RC</span>
              </button>
            )}

            {/* Share Research Primary CTA */}
            <button
              onClick={() => onNavigate('upload')}
              className="hidden sm:flex bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-xs font-bold px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-teal-900/30 items-center gap-1.5 transition-all active:scale-95 shrink-0"
              title="Publish or archive your scholarly work"
            >
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Share Research</span>
            </button>

            {/* User Session Profile & Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-2 sm:px-2.5 py-1.5 rounded-xl transition-all shadow-xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-xs font-black text-white shadow-xs shrink-0">
                    {userInitial}
                  </div>
                  <span className="hidden md:inline font-semibold text-xs text-slate-200 truncate max-w-[85px]">
                    {userFirstName}
                  </span>
                  {verifiedStatus === 'VERIFIED' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 hidden sm:inline" />
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 space-y-0.5">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.profile?.fullName || user.email}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[10px] font-semibold bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                          {user.role}
                        </span>
                        {verifiedStatus === 'VERIFIED' ? (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        ) : verifiedStatus === 'PENDING' ? (
                          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                            <Clock className="w-3 h-3 text-amber-600" />
                            In Review
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('profile', user.id);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between text-slate-700"
                      >
                        <span className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-teal-600" />
                          Researcher Profile
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('library');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between text-slate-700"
                      >
                        <span className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-teal-600" />
                          Saved Library
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('profile', user.id);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between text-slate-700"
                      >
                        <span className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-amber-500" />
                          Impact Wallet & Payouts
                        </span>
                        <span className="font-mono text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                          {walletBalance} RC
                        </span>
                      </button>

                      {(user.role === 'SUPER_ADMIN' ||
                        user.role === 'ADMIN' ||
                        user.role === 'MODERATOR' ||
                        user.role === 'EDITOR') && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-amber-50/70 text-amber-900 flex items-center justify-between border-t border-slate-100"
                        >
                          <span className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-600" />
                            {user.role === 'SUPER_ADMIN'
                              ? 'Super Admin Governance'
                              : 'Admin & Moderation'}
                          </span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                            Portal
                          </span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-700 transition-colors shadow-xs shrink-0"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
