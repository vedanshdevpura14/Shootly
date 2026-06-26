'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, FileText, CheckCircle, Clock, Mail, Loader2, CreditCard } from 'lucide-react';
import { Professional } from '@/types/photographer';

interface ManualPaymentModalProps {
  professional: Professional;
  isOpen: boolean;
  onClose: () => void;
}

export default function ManualPaymentModal({ professional, isOpen, onClose }: ManualPaymentModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [duration, setDuration] = useState(4);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const [agreedAmount, setAgreedAmount] = useState<number | ''>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedAmount) return setError("Please enter the agreed amount.");

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId: professional.id,
          clientName,
          clientEmail,
          eventStartDate: startDate,
          eventEndDate: endDate,
          eventType: "Booking",
          message: `Location: ${location}\nDuration: ${duration} hours/day\n\nDetails: ${details}\nAgreed Amount via Chat/Mail.`,
          amount: agreedAmount,
          status: "Pending",
        }),
      });

      if (!response.ok) throw new Error('Failed to process booking');

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-fade-in-up my-8">
        <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10">
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="p-6 text-center space-y-4 flex flex-col items-center justify-center min-h-[280px]">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Booking Request Sent!</h3>
              <p className="text-zinc-400 text-xs mt-1.5">You will be redirected to payment shortly.</p>
            </div>
            <button onClick={onClose} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg text-sm">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                {professional.image ? (
                  <img src={professional.image} alt={professional.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-amber-500">
                    {professional.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest block">Pay & Book</span>
                <h3 className="text-sm font-bold text-white">{professional.name}</h3>
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-2.5 rounded-lg">{error}</div>}

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400">Your Name</label>
                  <input required type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-600/50" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1"><Mail className="w-3 h-3 text-zinc-500" />Email</label>
                  <input required type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-600/50" placeholder="john@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1"><Calendar className="w-3 h-3 text-zinc-500" />Start Date</label>
                  <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-600/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1"><Calendar className="w-3 h-3 text-zinc-500" />End Date</label>
                  <input required type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-600/50" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1"><MapPin className="w-3 h-3 text-zinc-500" />Location</label>
                <input required type="text" placeholder="Enter full address" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-600/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3 text-zinc-500" />Daily Duration</label>
                <div className="flex items-center gap-3">
                  <input type="range" min="2" max="12" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-600" />
                  <span className="text-xs font-bold text-white w-10 text-right">{duration}h</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1"><CreditCard className="w-3 h-3 text-zinc-500" />Agreed Amount (₹)</label>
                <input required type="number" placeholder="Enter price agreed via email" value={agreedAmount} onChange={(e) => setAgreedAmount(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-600/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1"><FileText className="w-3 h-3 text-zinc-500" />Details</label>
                <textarea rows={2} placeholder="Reference the email conversation..." value={details} onChange={(e) => setDetails(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-600/50 resize-none" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg text-xs font-semibold transition-colors active:scale-95 shadow-lg shadow-amber-600/10 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
              Pay ₹{agreedAmount ? agreedAmount.toLocaleString() : '0'} & Book
            </button>
          </form>
        )}
      </div>
    </div>
  );
}