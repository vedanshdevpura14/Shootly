"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Upload, Trash2, ImagePlus, Loader2 } from "lucide-react";

interface PortfolioItem {
  id: number;
  imageUrl: string;
  caption: string | null;
}

export default function PortfolioPage() {
  const { data: session, status } = useSession();
  const [images, setImages] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch portfolio from database
  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      if (res.ok) {
        setImages(data.portfolios || []);
      }
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPortfolio();
    }
  }, [status, fetchPortfolio]);

  // Handle File Upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/portfolio/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        fetchPortfolio(); // Refresh the gallery
      } else {
        setMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  // Handle File Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        setImages(images.filter((img) => img.id !== id));
        setMessage({ type: "success", text: "Photo deleted successfully" });
      } else {
        setMessage({ type: "error", text: "Failed to delete photo" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setDeletingId(null);
    }
  };

  // Loading State
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">Portfolio</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your public portfolio images. {images.length} photo{images.length !== 1 ? "s" : ""} uploaded.
          </p>
        </div>
        
        {/* Upload Button (triggers hidden file input) */}
        <label 
          className={`px-5 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2 flex-shrink-0 cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> Upload Photos
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Feedback Message */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
          message.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-700" 
            : "bg-red-50 border border-red-200 text-red-600"
        }`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImagePlus className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No photos yet</h3>
          <p className="text-sm text-slate-500 mb-6">Upload your best work to attract clients.</p>
          <label className="px-5 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2 cursor-pointer mx-auto w-fit">
            <Upload className="w-4 h-4" /> Upload Your First Photo
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      ) : (
        /* Photo Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden aspect-square bg-slate-100 border border-slate-100">
              <img 
                src={img.imageUrl} 
                alt={img.caption || "Portfolio"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(img.id)} 
                  disabled={deletingId === img.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 bg-red-500/90 rounded-full flex items-center justify-center text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === img.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}

          {/* Add More Card */}
          <label className="rounded-xl border-2 border-dashed border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 flex flex-col items-center justify-center cursor-pointer transition-all aspect-square gap-2">
            <ImagePlus className="w-8 h-8 text-slate-300" />
            <span className="text-xs text-slate-400 font-medium">Add More</span>
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      )}
    </div>
  );
}