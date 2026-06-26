"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { CalendarCheck, Clock, CheckCircle, IndianRupee, ArrowUpRight, Eye } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: number;
  clientName: string;
  eventStartDate: string | null;
  eventEndDate: string | null;
  eventType: string;
  status: string;
  amount: number;
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileSlug, setProfileSlug] = useState<string | null>(null);
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  useEffect(() => {
    // Fetch bookings
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch professional profile slug
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (data.professional?.slug) {
          setProfileSlug(data.professional.slug);
        }
      })
      .catch(() => {});
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", { day: 'numeric', month: 'short' });
  };

  const formatDateRange = (start: string | null, end: string | null) => {
    if (!start && !end) return "Date not set";
    if (!end) return formatDate(start);
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const totalBookings = bookings.length;
  const pendingRequests = bookings.filter(b => b.status === "Pending").length;
  const completedShoots = bookings.filter(b => b.status === "Completed").length;
  const totalEarnings = bookings.filter(b => b.status === "Completed").reduce((acc, b) => acc + b.amount, 0);

  const stats = [
    { name: "Total Bookings", value: totalBookings, change: "+12%", icon: CalendarCheck, color: "bg-blue-50 text-blue-600" },
    { name: "Pending Requests", value: pendingRequests, change: `+${pendingRequests}`, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { name: "Completed Shoots", value: completedShoots, change: "+8%", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { name: "Total Earnings", value: `₹${totalEarnings.toLocaleString()}`, change: "+22%", icon: IndianRupee, color: "bg-violet-50 text-violet-600" },
  ];

  if (loading) return (
    <div className="p-6 lg:p-10 text-center pt-20">
      <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-sm text-slate-500">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">Welcome back, {firstName}</h1>
        <p className="text-sm text-slate-500 mt-1">Here's what's happening with your Shootly profile.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">{stat.change} <ArrowUpRight className="w-3 h-3" /></span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-400 mt-1">{stat.name}</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link 
          href="/dashboard/portfolio" 
          className="px-5 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          📸 Upload Photos
        </Link>
        
        {profileSlug ? (
          <Link
            href={`/photographers/${profileSlug}`}
            target="_blank"
            className="px-5 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> View Public Profile
          </Link>
        ) : (
          <span className="px-5 py-2.5 border border-slate-100 text-slate-300 text-sm font-semibold rounded-xl flex items-center gap-2 cursor-not-allowed">
            <Eye className="w-4 h-4" /> Profile unavailable
          </span>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">View all</Link>
        </div>
        
        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarCheck className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No bookings yet. Complete your profile to start getting clients!</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Client</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Date</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Type</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{booking.clientName}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDateRange(booking.eventStartDate, booking.eventEndDate)}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{booking.eventType}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          booking.status === "Pending" ? "bg-amber-50 text-amber-700" :
                          booking.status === "Accepted" ? "bg-blue-50 text-blue-700" :
                          "bg-emerald-50 text-emerald-700"
                        }`}>{booking.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">₹{booking.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-100">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-900">{booking.clientName}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      booking.status === "Pending" ? "bg-amber-50 text-amber-700" :
                      booking.status === "Accepted" ? "bg-blue-50 text-blue-700" :
                      "bg-emerald-50 text-emerald-700"
                    }`}>{booking.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDateRange(booking.eventStartDate, booking.eventEndDate)} • {booking.eventType}</span>
                    <span className="text-sm font-semibold text-slate-900">₹{booking.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}