import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';
import { api } from '../api/client';
import { Publication } from '../types';

interface CitationExportModalProps {
  publication: Publication;
  isOpen: boolean;
  onClose: () => void;
}

export const CitationExportModal: React.FC<CitationExportModalProps> = ({ publication, isOpen, onClose }) => {
  const [format, setFormat] = useState<'bibtex' | 'ris' | 'apa' | 'ieee'>('bibtex');
  const [citationText, setCitationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCitation(format);
    }
  }, [isOpen, format, publication.id]);

  const loadCitation = async (fmt: 'bibtex' | 'ris' | 'apa' | 'ieee') => {
    setLoading(true);
    try {
      const text = await api.exportCitation(publication.id, fmt);
      setCitationText(text);
    } catch (err) {
      setCitationText('Failed to generate citation for this item.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'bibtex' ? 'bib' : format === 'ris' ? 'ris' : 'txt';
    const blob = new Blob([citationText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `citation-${publication.id.slice(0, 8)}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="font-semibold text-base">Export Bibliographic Citation</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 line-clamp-1 font-medium">{publication.title}</p>

          {/* Format Tabs */}
          <div className="flex border-b border-slate-200 gap-2">
            {(['bibtex', 'ris', 'apa', 'ieee'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`pb-2 px-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                  format === fmt
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Preview Box */}
          <div className="relative">
            {loading ? (
              <div className="h-44 bg-slate-50 rounded-lg flex items-center justify-center text-xs text-slate-400">
                Formatting citation...
              </div>
            ) : (
              <pre className="h-44 bg-slate-900 text-slate-100 p-3.5 rounded-lg text-xs font-mono overflow-auto whitespace-pre-wrap select-all">
                {citationText}
              </pre>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download File
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy Citation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
