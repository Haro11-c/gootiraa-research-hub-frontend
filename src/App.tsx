import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

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

  const handleNavigate = (tab: string, param?: string) => {
    setCurrentTab(tab);
    setCurrentParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans w-full max-w-full overflow-x-hidden">
        <Navbar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        <main className="flex-1 py-4 sm:py-6 w-full max-w-full overflow-x-hidden">
          {currentTab === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentTab === 'discovery' && (
            <DiscoveryPage initialQuery={currentParam} onNavigate={handleNavigate} />
          )}
          {currentTab === 'publication' && currentParam && (
            <PublicationDetailPage publicationId={currentParam} onNavigate={handleNavigate} />
          )}
          {currentTab === 'profile' && currentParam && (
            <ResearcherProfilePage researcherId={currentParam} onNavigate={handleNavigate} />
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

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </AuthProvider>
  );
};

export default App;
