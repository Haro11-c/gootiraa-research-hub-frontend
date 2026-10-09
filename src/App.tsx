import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { RequestVerificationModal } from './components/RequestVerificationModal';

import { HomePage } from './pages/HomePage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { PublicationDetailPage } from './pages/PublicationDetailPage';
import { ResearcherProfilePage } from './pages/ResearcherProfilePage';
import { UploadWizardPage } from './pages/UploadWizardPage';
import { EditorialPage } from './pages/EditorialPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AIWorkspacePage } from './pages/AIWorkspacePage';
import { LibraryPage } from './pages/LibraryPage';
import { AdminPage } from './pages/AdminPage';
import { PolicyPage } from './pages/PolicyPage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentParam, setCurrentParam] = useState<string | undefined>(undefined);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  // ChatGPT-style: Defaultly open on desktop (width >= 1024px), closed on mobile devices (< 1024px)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gootiraa_sidebar_open');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Responsive resize watcher: adjusts if user hasn't explicitly set preference
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && localStorage.getItem('gootiraa_sidebar_open') === null) {
        setSidebarOpen(window.innerWidth >= 1024);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('gootiraa_sidebar_open', String(next));
      return next;
    });
  };

  const handleNavigate = (tab: string, param?: string) => {
    setCurrentTab(tab);
    setCurrentParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // On small screen mobile devices, close sidebar upon navigation
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans w-full max-w-full overflow-x-hidden">
        {/* ChatGPT Style Sidebar: Docked on desktop, overlay drawer on mobile */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleToggleSidebar}
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenVerification={() => setVerifyModalOpen(true)}
        />

        {/* Main Content Area — shifts smoothly on desktop when sidebar is open */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
          }`}
        >
          {/* Navigation Bar */}
          <Navbar
            currentTab={currentTab}
            sidebarOpen={sidebarOpen}
            onNavigate={handleNavigate}
            onOpenAuth={() => setAuthModalOpen(true)}
            onToggleSidebar={handleToggleSidebar}
          />

          {/* Main Routed Content */}
          <main className="flex-1 py-4 sm:py-6 w-full max-w-full overflow-x-hidden">
            {currentTab === 'home' && <HomePage onNavigate={handleNavigate} />}
            {currentTab === 'discovery' && (
              <DiscoveryPage initialQuery={currentParam} onNavigate={handleNavigate} />
            )}
            {currentTab === 'publication' && currentParam && (
              <PublicationDetailPage publicationId={currentParam} onNavigate={handleNavigate} />
            )}
            {currentTab === 'profile' && currentParam && (
              <ResearcherProfilePage
                researcherId={currentParam}
                onNavigate={handleNavigate}
                onOpenVerification={() => setVerifyModalOpen(true)}
              />
            )}
            {currentTab === 'upload' && (
              <UploadWizardPage onNavigate={handleNavigate} onOpenAuth={() => setAuthModalOpen(true)} />
            )}
            {currentTab === 'editorial' && <EditorialPage onNavigate={handleNavigate} />}
            {currentTab === 'article' && currentParam && (
              <ArticleDetailPage slug={currentParam} onNavigate={handleNavigate} />
            )}
            {currentTab === 'ai' && <AIWorkspacePage onNavigate={handleNavigate} />}
            {currentTab === 'library' && (
              <LibraryPage onNavigate={handleNavigate} onOpenAuth={() => setAuthModalOpen(true)} />
            )}
            {currentTab === 'admin' && <AdminPage />}
            {currentTab === 'policy' && <PolicyPage />}
          </main>

          <Footer onNavigate={handleNavigate} />
        </div>

        {/* Authentication Modal */}
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

        {/* Scholar Verification KYC Request Modal */}
        <RequestVerificationModal
          isOpen={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
        />
      </div>
    </AuthProvider>
  );
};

export default App;
