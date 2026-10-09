import React, { useState } from 'react';
import { X, ArrowDownRight, ShieldCheck, AlertTriangle, CheckCircle2, Wallet, Building, Smartphone, Globe } from 'lucide-react';
import { api } from '../api/client';

interface WithdrawalModalProps {
  balanceCredits: number;
  isVerified: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CHANNELS = [
  { id: 'TELEBIRR', name: 'Telebirr (Ethio Telecom)', icon: Smartphone, desc: 'Instant mobile wallet transfer (09xxxxxxxx)' },
  { id: 'CBE_BANK', name: 'Commercial Bank of Ethiopia (CBE)', icon: Building, desc: 'Direct CBE account deposit' },
  { id: 'CHAPA', name: 'Chapa Gateway', icon: Wallet, desc: 'Domestic bank or wallet switch' },
  { id: 'BANK_WIRE', name: 'International Wire / SWIFT', icon: Globe, desc: 'Overseas institutional account (USD)' },
];

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  balanceCredits,
  isVerified,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [channel, setChannel] = useState<'TELEBIRR' | 'CBE_BANK' | 'CHAPA' | 'BANK_WIRE'>('TELEBIRR');
  const [currency, setCurrency] = useState<'ETB' | 'USD'>('ETB');
  const [amountCredits, setAmountCredits] = useState<number>(1000);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const minWithdrawal = 1000;
  const isInsufficient = balanceCredits < minWithdrawal;
  const fiatEquivalent = currency === 'ETB' ? amountCredits : (amountCredits * 0.01).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      setError('Academic identity verification required. Please verify your institution affiliation first.');
      return;
    }
    if (amountCredits < minWithdrawal) {
      setError(`Minimum withdrawal is ${minWithdrawal} Research Credits (RC).`);
      return;
    }
    if (amountCredits > balanceCredits) {
      setError(`Requested amount exceeds your available balance of ${balanceCredits} RC.`);
      return;
    }
    if (!accountNumber.trim() || !accountName.trim()) {
      setError('Please provide valid account credentials and account holder name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.requestWithdrawal({
        amountCredits,
        channel,
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
        currency,
      });

      setSuccess(true);
      onSuccess();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Withdrawal request failed. Please check compliance details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Redeem Impact Credits</h3>
              <p className="text-xs text-slate-300">Institutional & Scholar Payout Request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Payout Request Submitted</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your request to redeem <strong>{amountCredits} RC</strong> ({currency} {fiatEquivalent}) via {channel} has been sent for Super Admin compliance verification. Funds are disbursed within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Wallet Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-medium text-slate-500">Available Impact Balance</div>
                  <div className="text-xl font-extrabold text-teal-700">
                    {balanceCredits.toLocaleString()} <span className="text-xs font-semibold text-slate-600">RC</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-medium text-slate-500">Estimated Value</div>
                  <div className="text-sm font-bold text-slate-900">
                    ETB {balanceCredits.toLocaleString()} / ${(balanceCredits * 0.01).toFixed(2)} USD
                  </div>
                </div>
              </div>

              {/* KYC Check Warning */}
              {!isVerified ? (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Institutional Verification Required</strong>
                    <span>
                      To prevent predatory paper mills and fraudulent bots, payouts are strictly restricted to verified scholars affiliated with recognized academic or research institutions.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Verified Academic Identity &bull; <strong>Eligible for instant automated compliance payout</strong>
                  </span>
                </div>
              )}

              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Disbursement Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CHANNELS.map((ch) => {
                    const isSelected = channel === ch.id;
                    const IconComponent = ch.icon;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          setChannel(ch.id as any);
                          if (ch.id === 'BANK_WIRE') setCurrency('USD');
                          else setCurrency('ETB');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-600/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 ${isSelected ? 'text-teal-700' : 'text-slate-500'}`} />
                          <span className="text-xs font-bold text-slate-900">{ch.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{ch.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount to Redeem */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Amount (Credits)
                  </label>
                  <input
                    type="number"
                    min={minWithdrawal}
                    max={balanceCredits}
                    step="100"
                    value={amountCredits}
                    onChange={(e) => setAmountCredits(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Min: 1,000 RC</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Disbursement Value
                  </label>
                  <div className="w-full text-xs font-bold text-slate-900 border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
                    <span>{currency}</span>
                    <span>{fiatEquivalent}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">1 RC = 1.00 ETB / $0.01 USD</span>
                </div>
              </div>

              {/* Destination Account Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {channel === 'TELEBIRR' ? 'Telebirr Phone Number' : 'Account / IBAN / Swift Number'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={channel === 'TELEBIRR' ? 'e.g. 0911234567' : 'e.g. 100023456789 or IBAN'}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Registered Full Legal Name on Account
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Almaz Bekele Abera"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Error display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isInsufficient || !isVerified}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : `Withdraw ${fiatEquivalent} ${currency}`}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
