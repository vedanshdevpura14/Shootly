"use client";

import React, { useState, useEffect } from "react";
import { Save, User } from "lucide-react";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    category: "Wedding",
    price: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/profile")
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setFormData({
            name: data.name || "",
            city: data.city || "",
            category: data.category || "Wedding",
            price: data.price?.toString() || "",
            bio: data.bio || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage("Profile saved successfully!");
      } else {
        setMessage("Failed to save. Try again.");
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-6 lg:p-10 text-center pt-20">
      <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-sm text-slate-500">Loading profile...</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">Edit Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Update your public profile information.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 max-w-3xl space-y-6">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
          <div className="w-24 h-24 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-amber-600" />
          </div>
          <div>
            <button type="button" className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors">
              Upload Photo
            </button>
            <p className="text-[10px] text-slate-400 mt-2">JPG, PNG. Max 5MB.</p>
          </div>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white">
              <option>Wedding</option>
              <option>Portrait</option>
              <option>Events</option>
              <option>Travel</option>
              <option>Fashion</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Starting Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Bio</label>
          <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none" />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={saving} className="px-6 py-3 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}