"use client";

import React, { useState, useEffect } from "react";
import { CalendarCheck, Clock, Filter, Check, X, MessageSquare, Loader2, XCircle } from "lucide-react";

// 1. Updated Interface to match the new Date Range Schema
interface Booking {
  id: number;
  clientName: string;
  eventStartDate: string | null; // New Field
  eventEndDate: string | null;   // New Field
  eventType: string;
  status: string;
  amount: number;
  clientEmail: string;
  professional: { name: string; };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  
  // States for handling actions
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [counterOffer, setCounterOffer] = useState<Booking | null>(null);
  const [offerDates, setOfferDates] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filters = ["All", "Pending", "Accepted", "Completed", "Declined", "Countered"];
  const filteredBookings = activeFilter === "All" 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-50 text-amber-700";
      case "Accepted": return "bg-blue-50 text-blue-700";
      case "Completed": return "bg-emerald-50 text-emerald-700";
      case "Declined": return "bg-red-50 text-red-700";
      case "Countered": return "bg-violet-50 text-violet-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  // 2. Helper function to format the date range safely
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", { day: 'numeric', month: 'short' });
  };

  const formatDateRange = (start: string | null, end: string | null) => {
    if (!start && !end) return "Date not set";
    if (!end) return formatDate(start); // Only start date exists
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  // Handle Accept or Reject directly
  const handleQuickAction = async (booking: Booking, action: "Accepted" | "Declined") => {
    setActionLoading(booking.id);
    try {
      const res = await fetch("/api/bookings/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id, action }),
      });
      
      if (res.ok) {
        // Update local state to reflect change immediately
        setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: action } : b));
      } else {
        alert("Failed to update booking. Make sure your API is set up.");
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  // Submit Counter Offer (Sends email with custom dates/price)
  const submitCounterOffer = async () => {
    if (!counterOffer || !offerDates || !offerPrice) return alert("Please fill in all fields.");
    
    setActionLoading(counterOffer.id);
    try {
      const res = await fetch("/api/bookings/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: counterOffer.id,
          action: "Countered",
          newDates: offerDates,
          newPrice: offerPrice
        }),
      });

      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === counterOffer.id ? { ...b, status: "Countered" } : b));
        setCounterOffer(null);
        setOfferDates("");
        setOfferPrice("");
      } else {
        alert("Failed to send counter offer.");
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="p-6 lg:p-10 text-center pt-20">
      <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-sm text-slate-500">Loading bookings...</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 relative">
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">Bookings</h1>
        <p className="text-sm text-slate-500 mt-1">Accept, reject, or counter-offer directly. Clients are notified via email instantly.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === filter 
                ? "bg-slate-900 text-white" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No {activeFilter.toLowerCase()} bookings found.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-amber-700">{booking.clientName.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{booking.clientName}</h3>
                    <p className="text-xs text-slate-500">
                      {/* 3. Updated to display Date Range */}
                      {formatDateRange(booking.eventStartDate, booking.eventEndDate)} • {booking.eventType} • via {booking.professional?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 sm:gap-6 pl-16 sm:pl-0">
                  <span className="text-sm font-bold text-slate-900">₹{booking.amount.toLocaleString()}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Pending & Inquiry Bookings */}
{(booking.status === "Pending" || booking.status === "Inquiry") && (
  <div className="flex flex-wrap items-center gap-2 pl-16 sm:pl-16 border-t border-slate-100 pt-4 mt-2">
    {/* 1. Accept Button (Shows on both) */}
    <button 
      onClick={() => handleQuickAction(booking, "Accepted")}
      disabled={actionLoading === booking.id}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
    >
      {actionLoading === booking.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
      Accept
    </button>
    
    {/* 2. Reject Button (Shows on both) */}
    <button 
      onClick={() => handleQuickAction(booking, "Declined")}
      disabled={actionLoading === booking.id}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
    >
      <X className="w-3 h-3" />
      Reject
    </button>

    {/* 3. Counter Offer Button (ONLY shows on "Inquiry", NOT on direct Bookings) */}
    {booking.status === "Inquiry" && (
      <button 
        onClick={() => setCounterOffer(booking)}
        disabled={actionLoading === booking.id}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-lg hover:bg-violet-100 transition-colors disabled:opacity-50"
      >
        <MessageSquare className="w-3 h-3" />
        Counter Offer
      </button>
    )}
  </div>
)}
            </div>
          ))
        )}
      </div>

      {/* Counter Offer Modal */}
      {counterOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <button onClick={() => setCounterOffer(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <XCircle className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Counter Offer</h2>
            <p className="text-sm text-slate-500 mb-6">Send {counterOffer.clientName} your available dates and per-day price.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Available Dates</label>
                <input 
                  type="text" 
                  value={offerDates}
                  onChange={(e) => setOfferDates(e.target.value)}
                  placeholder="e.g. 2026-06-18 or 2026-06-20 to 2026-06-22"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Price Per Day (₹)</label>
                <input 
                  type="number" 
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="e.g. 8000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button 
              onClick={submitCounterOffer}
              disabled={actionLoading === counterOffer.id}
              className="w-full mt-6 px-4 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {actionLoading === counterOffer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              Send Counter Offer via Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}