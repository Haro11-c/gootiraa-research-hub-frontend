import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Upload,
  User as UserIcon,
  LogOut,
  Shield,
  Bookmark,
  Sparkles,
  Newspaper,
  Compass,
  Menu,
  X,
  Globe,
  Coins,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [lang, setLang] = useState('EN');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('discovery', searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B192C] text-white shadow-md border-b border-[#1E3E62]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-inner font-bold">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                GOOTIRAA
                <span className="text-xs uppercase px-1.5 py-0.5 rounded bg-teal-800 text-teal-200 font-semibold tracking-normal">
                  Hub
                </span>
              </span>
              <p className="text-[10px] text-slate-300 tracking-wide font-sans -mt-1 hidden sm:block">
                Scholarly Repository & Science Journalism
              </p>
            </div>
          </div>

          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search papers, DOIs, authors, Ethiopian research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1E3E62]/80 text-white placeholder-slate-300 text-sm rounded-lg pl-9 pr-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-[#1E3E62]"
              />
              <Search className="w-4 h-4 text-slate-300 absolute left-3 top-2.5" />
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('discovery')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentTab === 'discovery' ? 'bg-[#1E3E62] text-teal-300' : 'text-slate-200 hover:bg-[#1E3E62]/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              Discovery
            </button>

            <button
              onClick={() => onNavigate('editorial')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentTab === 'editorial' ? 'bg-[#1E3E62] text-teal-300' : 'text-slate-200 hover:bg-[#1E3E62]/60'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              Editorial & News
            </button>

            <button
              onClick={() => onNavigate('ai')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentTab === 'ai' ? 'bg-[#1E3E62] text-teal-300' : 'text-slate-200 hover:bg-[#1E3E62]/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              AI Assistant
            </button>

            <button
              onClick={() => onNavigate('policy')}
              className={`px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-[#1E3E62]/60 transition-colors ${
                currentTab === 'policy' ? 'bg-[#1E3E62] text-teal-300' : ''
              }`}
            >
              Integrity & Policies
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLang(lang === 'EN' ? 'AM' : lang === 'AM' ? 'OM' : 'EN')}
                className="text-xs bg-[#1E3E62] text-slate-300 px-2 py-1 rounded flex items-center gap-1 border border-slate-600 hover:text-white"
                title="Switch UI Language"
              >
                <Globe className="w-3 h-3 text-teal-400" />
                {lang === 'EN' ? 'EN' : lang === 'AM' ? 'አማ (Amh)' : 'Oro (Afaan)'}
              </button>
            </div>

            {/* Upload Publication CTA */}
            <button
              onClick={() => onNavigate('upload')}
              className="bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Share Research</span>
              <span className="sm:hidden">Share</span>
            </button>

            {/* User Session Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-sm bg-[#1E3E62] hover:bg-[#284E7A] px-2.5 py-1.5 rounded-lg border border-slate-600"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-700 flex items-center justify-center text-xs font-bold text-white">
                    {user.profile?.fullName?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline font-medium text-slate-200 truncate max-w-[120px]">
                    {user.profile?.fullName?.split(' ')[0] || user.email.split('@')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.profile?.fullName || user.email}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('profile', user.id);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <UserIcon className="w-4 h-4 text-teal-600" />
                      Researcher Profile
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('library');
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Bookmark className="w-4 h-4 text-teal-600" />
                      Saved Library
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('profile', user.id);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Coins className="w-4 h-4 text-amber-500" />
                      Impact Wallet & Earnings
                    </button>

                    {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'MODERATOR' || user.role === 'EDITOR') && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700 border-t border-slate-100"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        {user.role === 'SUPER_ADMIN' ? 'Super Admin Governance' : 'Admin & Moderation'}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-[#1E3E62] hover:bg-[#284E7A] px-3.5 py-1.5 rounded-lg border border-slate-600 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-[#1E3E62]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B192C] border-b border-[#1E3E62] px-4 pt-2 pb-4 space-y-2">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1E3E62] text-white placeholder-slate-400 text-sm rounded-lg pl-9 pr-4 py-2 border border-slate-600 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </form>

          <button
            onClick={() => {
              onNavigate('discovery');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-[#1E3E62]"
          >
            Discovery
          </button>
          <button
            onClick={() => {
              onNavigate('editorial');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-[#1E3E62]"
          >
            Editorial & Fact-Checks
          </button>
          <button
            onClick={() => {
              onNavigate('ai');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-[#1E3E62]"
          >
            AI Research Assistant
          </button>
          <button
            onClick={() => {
              onNavigate('policy');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-[#1E3E62]"
          >
            Integrity Charter & Policies
          </button>
        </div>
      )}
    </header>
  );
};
