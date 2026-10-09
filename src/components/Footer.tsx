import React from 'react';
import { BookOpen, Shield, Globe, Award, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B192C] text-slate-300 border-t border-[#1E3E62] pt-12 pb-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Platform Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
              <span className="text-lg font-bold text-white tracking-tight">GOOTIRAA RESEARCH HUB</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An open, high-integrity scholarly discovery and science journalism repository dedicated to advancing
              scientific communication, pan-African academic visibility, and evidence-grounded research exchange.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <Shield className="w-4 h-4" />
              <span>Independent & Non-Profit Academic Initiative</span>
            </div>
          </div>

          {/* Col 2: Research Modules */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-1">
              Scholarly Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('discovery')} className="hover:text-teal-400 transition-colors">
                  Scholarly Discovery & Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('editorial')} className="hover:text-teal-400 transition-colors">
                  Science News & Explainers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('editorial')} className="hover:text-teal-400 transition-colors">
                  Empirical Fact-Check Bureau
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai')} className="hover:text-teal-400 transition-colors">
                  Grounded AI Research Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('upload')} className="hover:text-teal-400 transition-colors">
                  Submit Research & Preprints
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Standards & Provenance */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-1">
              Data & Ethics
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('policy')} className="hover:text-teal-400 transition-colors">
                  Research Integrity & Review Badges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy')} className="hover:text-teal-400 transition-colors">
                  Copyright & Takedown (DMCA)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy')} className="hover:text-teal-400 transition-colors">
                  Privacy Policy & Data Rights
                </button>
              </li>
              <li>
                <span className="text-slate-500">Crossref & OpenAlex Integration</span>
              </li>
              <li>
                <span className="text-slate-500">arXiv Open Preprint Ingestion</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional Hub */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-1">
              African Universities
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Actively partnering with university research offices and independent repositories across the continent.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] bg-[#1E3E62] text-slate-300 px-2 py-0.5 rounded">Addis Ababa Univ.</span>
              <span className="text-[11px] bg-[#1E3E62] text-slate-300 px-2 py-0.5 rounded">Jimma Univ.</span>
              <span className="text-[11px] bg-[#1E3E62] text-slate-300 px-2 py-0.5 rounded">Ethiopian AI Inst.</span>
              <span className="text-[11px] bg-[#1E3E62] text-slate-300 px-2 py-0.5 rounded">Hawassa Univ.</span>
              <span className="text-[11px] bg-[#1E3E62] text-slate-300 px-2 py-0.5 rounded">Mekelle Univ.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Provenance Disclaimer */}
        <div className="border-t border-[#1E3E62] pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Gootiraa Research Hub. Designed for open science, academic rigor, and verified truth.
          </p>
          <div className="text-[11px] text-slate-400 max-w-xl text-center md:text-right">
            <span>
              Disclaimer: Research review status (Peer-Reviewed vs Preprint) is indicated according to verified publishing data.
              Metrics are derived from authentic repository access logs and official metadata registries.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
