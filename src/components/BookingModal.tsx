'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, FileText, CheckCircle, Clock, Mail, Loader2, CreditCard } from 'lucide-react';
import { Professional } from '@/types/photographer';

interface BookingModalProps {
  professional: Professional;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ professional, isOpen, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [duration, setDuration] = useState(4);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  
  // NEW STATE: Manual Price Input
  const [agreedAmount, setAgreedAmount] = useState<number | ''>('');
  
  // Client Type State (From your code)
  const [clientType, setClientType] = useState("Individual");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Ensure user entered an amount
    if (!agreedAmount) {
      setError("Please enter the agreed amount.");
      return;
    }

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
          eventType: clientType, // Using Client Type here
          message: `Location: ${location}\nDuration: ${duration} hours/day\n\nDetails: ${details}`,
          amount: agreedAmount, // Sending manual amount
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center p-4 pt-24 md:pt-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-xl shadow-2xl relative animate-fade-in-up my-auto max-h-[85vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-display text-white">
                Booking Request Sent!
              </h3>
              <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                Your request has been forwarded to <strong>{professional.name}</strong>.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-2xl w-full text-left text-xs space-y-2 text-zinc-400">
              <div><strong>Client:</strong> {clientName}</div>
              <div><strong>Dates:</strong> {startDate ? `${new Date(startDate).toDateString()} - ${new Date(endDate).toDateString()}` : 'Not specified'}</div>
              <div><strong>Total Paid:</strong> ₹{Number(agreedAmount).toLocaleString('en-IN')}</div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
                setStartDate('');
                setEndDate('');
                setLocation('');
                setDetails('');
                setAgreedAmount('');
              }}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Header / Talent Details */}
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850">
                <img
                  src={professional.image || "/default-avatar.png"}
                  alt={professional.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block">
                  Booking Talent
                </span>
                <h3 className="text-lg font-bold font-display text-white">
                  {professional.name}
                </h3>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Client Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Your Name</label>
                  <input
                    required
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-600/50"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-zinc-500" />
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-600/50"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Client Type</label>
                <select 
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-600/50"
                >
                  <option>Individual</option>
                  <option>Corporate</option>
                  <option>Event Organizer</option>
                </select>
              </div>

              {/* Date Range Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-600/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-600/50"
                  />
                </div>
              </div>

              {/* Location Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  Shoot / Event Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full address or city"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-amber-600/50"
                />
              </div>

              {/* Duration / Hours Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  Daily Duration (Hours)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="2"
                    max="12"
                    step="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <span className="text-sm font-bold text-white w-14 text-right">
                    {duration}h
                  </span>
                </div>
              </div>

              {/* Message Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-zinc-500" />
                  Shoot Details / Scope
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your requirements, outfit changes, style preferences..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-amber-600/50 resize-none"
                />
              </div>

              {/* AGREED AMOUNT INPUT */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-zinc-500" />
                  Agreed Amount (₹)
                </label>
                <input
                  required
                  type="number"
                  placeholder="Enter price agreed via email"
                  value={agreedAmount}
                  onChange={(e) => setAgreedAmount(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-amber-600/50"
                />
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-zinc-900 border border-zinc-850 p-4.5 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Agreed Amount</span>
                <span className="text-white font-medium">₹{agreedAmount ? Number(agreedAmount).toLocaleString('en-IN') : '0'}</span>
              </div>
              {/* Optional: You can keep the fee calculation or remove it if you pay full agreed amount */}
              <div className="flex justify-between text-zinc-400">
                <span>Platform Service Fee (5%)</span>
                <span>₹{agreedAmount ? Math.round(Number(agreedAmount) * 0.05).toLocaleString('en-IN') : '0'}</span>
              </div>
              <div className="h-px bg-zinc-850 my-1"></div>
              <div className="flex justify-between text-sm font-bold text-white">
                <span>Total Amount</span>
                <span>₹{agreedAmount ? Number(agreedAmount).toLocaleString('en-IN') : '0'}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-xl text-sm font-semibold transition-colors active:scale-95 shadow-lg shadow-amber-600/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${agreedAmount ? Number(agreedAmount).toLocaleString() : '0'} & Book`
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}