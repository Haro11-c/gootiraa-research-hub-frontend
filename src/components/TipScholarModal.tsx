import React, { useState } from 'react';
import { X, Coins, Sparkles, CheckCircle2, AlertCircle, Heart } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface TipScholarModalProps {
  receiverUserId: string;
  receiverName: string;
  publicationId?: string;
  publicationTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PRESET_AMOUNTS = [
  { credits: 100, etb: 100, label: '☕ Research Coffee' },
  { credits: 250, etb: 250, label: '📚 Literature Fund' },
  { credits: 500, etb: 500, label: '🔬 Lab & Dataset Support' },
  { credits: 1000, etb: 1000, label: '🏆 Research Patron' },
];

export const TipScholarModal: React.FC<TipScholarModalProps> = ({
  receiverUserId,
  receiverName,
  publicationId,
  publicationTitle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) {
      setError('Please select or enter an amount greater than 0.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.sendTip({
        receiverUserId,
        amountCredits: currentAmount,
        publicationId,
        message: message.trim() || undefined,
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2200);
    } catch (err: any) {
      setError(err.message || 'Failed to process patronage tip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header - Fixed & Always Visible */}
        <div className="shrink-0 bg-gradient-to-r from-[#0B192C] to-[#1E3E62] px-6 py-4 sm:py-5 text-white flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Support Scholarly Research</h3>
              <p className="text-xs text-slate-300">Direct Academic Patronage & Impact Credits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {success ? (
          <div className="overflow-y-auto flex-1 p-6 py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Patronage Sent Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              You have gifted <strong>{currentAmount} Research Credits</strong> to {receiverName}. A notification and impact receipt have been recorded.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Recipient summary */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Recipient Scholar:</span>
                  <span className="font-bold text-slate-900">{receiverName}</span>
                </div>
                {publicationTitle && (
                  <div className="flex items-start justify-between gap-3 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium shrink-0">For Paper:</span>
                    <span className="text-slate-700 text-right font-medium line-clamp-1 italic">{publicationTitle}</span>
                  </div>
                )}
              </div>

              {/* Information callout */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Direct Scholar Remittance:</strong> Research Impact Credits (RC) directly reward researchers for open knowledge, lab expenses, and dataset publishing (1,000 RC = 1,000 ETB / ~$20 USD).
                </span>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Impact Tier (Credits)
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {PRESET_AMOUNTS.map((preset) => {
                    const isSelected = selectedAmount === preset.credits && !customAmount;
                    return (
                      <button
                        key={preset.credits}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(preset.credits);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">{preset.credits} RC</span>
                          <span className="text-[10px] text-slate-500 font-mono">ETB {preset.etb}</span>
                        </div>
                        <span className="text-[11px] text-slate-600 font-medium mt-1">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount */}
                <div className="mt-3">
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      step="10"
                      placeholder="Or enter custom Credits (e.g. 750)"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 pl-9 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <Coins className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Personal Note to Scholar (Optional)
                </label>
                <textarea
                  rows={2}
                  maxLength={200}
                  placeholder="e.g. Exceptional methodology and rigorous data analysis! Excited for your next findings."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="anonymousCheck" className="text-xs text-slate-600">
                  Tip as an anonymous research supporter
                </label>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Footer Actions - Fixed at Bottom */}
            <div className="shrink-0 px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 z-10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || currentAmount <= 0}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Coins className="w-4 h-4" />
                <span>
                  {loading ? 'Processing...' : `Send ${currentAmount} RC Patronage`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
