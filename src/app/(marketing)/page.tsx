"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Star, Clock, BadgeCheck, Sparkles, MoveHorizontal, X, Upload, File as FileIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type ServiceTab = "shoot" | "reels" | "edit";

interface SearchState {
  city: string;
  category: string;
  tab: ServiceTab;
  submitted: boolean; // true after user clicks Search
}

interface EditorStat {
  value: string;
  label: string;
}

interface EditorSkill {
  label: string;
  variant: "primary" | "default" | "ai";
}

interface EditorData {
  id: number;
  name: string;
  verified: boolean;
  rating: number;
  projectCount: string;
  turnaround: string;
  avatarSeed: string;
  imageSeed: string;
  skills: EditorSkill[];
  stats: EditorStat[];
  pricingAmount: string;
  pricingUnit: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(msg);
    timerRef.current = setTimeout(() => setToast(null), 3000);
  };

  return { toast, showToast };
}
// Add this near your type definitions
function capitalizeCity(city: string): string {
  return city
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
// ─── useFadeObserver ──────────────────────────────────────────────────────────
function useFadeObserver() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

// ─── FadeSection ─────────────────────────────────────────────────────────────
function FadeSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, visible } = useFadeObserver();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      {children}
    </div>
  );
}

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0f172a",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: "12px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "14px",
        whiteSpace: "nowrap",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      {message}
    </div>
  );
}

// ─── Empty State Component ────────────────────────────────────────────────────
// ─── Empty State Component ────────────────────────────────────────────────────
function EmptyCityState({ city, type }: { city: string; type: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const capitalizeCity = (name: string) =>
    name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

  const cityDisplay = capitalizeCity(city);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email.trim()) {
      setErrorMsg("Please enter your email");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), city: city.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit. Please try again.");
      setStatus("error");
    }
  };

  // ── Success State ──
  if (status === "success") {
    return (
      <FadeSection>
        <div
          style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            border: "1px solid #bbf7d0",
            borderRadius: 20,
            padding: "48px 32px",
            textAlign: "center",
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              background: "#fff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 4px 20px rgba(22,163,74,0.15)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#15803d",
              marginBottom: 8,
            }}
          >
            You're on the list! 🎉
          </h3>
          <p
            style={{
              fontSize: 15,
              color: "#166534",
              lineHeight: 1.6,
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            We'll notify you at <strong>{email || "your email"}</strong> the moment we launch in{" "}
            <strong>{cityDisplay}</strong>.
          </p>
        </div>
      </FadeSection>
    );
  }

  // ── Default / Error State ──
  return (
    <FadeSection>
      <div
        style={{
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          border: "1px solid #fde68a",
          borderRadius: 20,
          padding: "48px 32px",
          textAlign: "center",
          maxWidth: 520,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            background: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 4px 20px rgba(217,119,6,0.15)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#92400e",
            marginBottom: 8,
          }}
        >
          We're expanding to {cityDisplay} soon!
        </h3>
        <p
          style={{
            fontSize: 15,
            color: "#a16207",
            lineHeight: 1.6,
            maxWidth: 400,
            margin: "0 auto 24px",
          }}
        >
          We don't have {type} in <strong>{cityDisplay}</strong> just yet, but we're growing fast. Leave your email and we'll notify you the moment we launch there.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: 8,
            maxWidth: 360,
            margin: "0 auto",
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="your@email.com"
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: status === "error" ? "1px solid #ef4444" : "1px solid #fde68a",
              fontSize: 14,
              outline: "none",
              background: "#fff",
              color: "#0f172a",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              padding: "12px 20px",
              background: status === "loading" ? "#92400e" : "#d97706",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: status === "loading" ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              opacity: status === "loading" ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {status === "loading" ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: "pulse 1s infinite" }}>
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Saving...
              </>
            ) : (
              "Notify Me"
            )}
          </button>
        </form>

        {status === "error" && errorMsg && (
          <p style={{ fontSize: 12, color: "#dc2626", marginTop: 12 }}>
            ⚠️ {errorMsg}
          </p>
        )}

        <p
          style={{
            fontSize: 12,
            color: "#d97706",
            marginTop: 16,
            opacity: 0.7,
          }}
        >
          🔔 You'll be the first to know when we arrive in {cityDisplay}
        </p>
      </div>
    </FadeSection>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = scrolled ? "#0f172a" : "#ffffff";
  const linkColor = scrolled ? "#475569" : "rgba(255,255,255,0.8)";

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: scrolled ? "#ffffff" : "transparent",
    boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
    borderBottom: scrolled ? "1px solid #f1f5f9" : "none",
    transition: "all 0.3s",
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "#d97706", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: textColor, transition: "color 0.3s" }}>Shootly</span>
        </a>

        <div className="shootly-desktop-nav">
          {[
            { href: "#photographers", label: "Photographers" },
            { href: "#reels", label: "Reels", badge: "NEW" },
            { href: "#editors", label: "Editors" },
            { href: "#how-it-works", label: "How It Works" },
            { href: "#ai-features", label: "AI Features", dot: true },
          ].map(({ href, label, badge, dot }) => (
            <a
              key={label}
              href={href}
              style={{ fontSize: 14, fontWeight: 500, color: linkColor, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#d97706")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = linkColor)}
            >
              {label}
              {badge && <span style={{ padding: "2px 6px", background: "#d97706", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 4 }}>{badge}</span>}
              {dot && <span style={{ width: 6, height: 6, background: "#f59e0b", borderRadius: "50%", animation: "pulse 2s infinite" }} />}
            </a>
          ))}
        </div>

        <div className="shootly-desktop-auth">
          <a href="/login" style={{ fontSize: 14, fontWeight: 500, color: linkColor, textDecoration: "none", padding: "8px 16px", display: "inline-block" }}>Log in</a>
          <a href="/signup" style={{ fontSize: 14, fontWeight: 500, background: "#d97706", color: "#fff", textDecoration: "none", padding: "10px 20px", borderRadius: 8, display: "inline-block" }}>Sign up</a>
        </div>

        <button className="shootly-mobile-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            {["Photographers", "Reels & Social Media", "Editors", "How It Works", "AI Features"].map((label) => (
              <a key={label} href="#" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, fontWeight: 500, color: "#334155", textDecoration: "none", padding: "10px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                {label}
                {label === "Reels & Social Media" && <span style={{ padding: "2px 6px", background: "#d97706", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 4 }}>NEW</span>}
              </a>
            ))}
            <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "8px 0" }} />
            <a href="/login" style={{ fontSize: 14, fontWeight: 500, color: "#334155", textDecoration: "none", padding: "10px 12px", display: "block" }}>Log in</a>
            <a href="/signup" style={{ background: "#d97706", color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "10px 12px", borderRadius: 8, display: "block", textAlign: "center" }}>Sign up</a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ search, onSearchChange }: { search: SearchState; onSearchChange: (s: SearchState) => void }) {
  const [localCity, setLocalCity] = useState(search.city);
  const [localCategory, setLocalCategory] = useState(search.category);

  // Sync local state when parent resets
  useEffect(() => { setLocalCity(search.city); }, [search.city]);
  useEffect(() => { setLocalCategory(search.category); }, [search.category]);

  const handleSearch = (tab: ServiceTab) => {
    onSearchChange({
      city: localCity.trim(),
      category: localCategory,
      tab,
      submitted: true,
    });
    // Scroll to the relevant section
    const sectionMap: Record<ServiceTab, string> = {
      shoot: "#photographers",
      reels: "#reels",
      edit: "#editors",
    };
    setTimeout(() => {
      const target = document.querySelector(sectionMap[tab]);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const tabs: { id: ServiceTab; emoji: string; label: string }[] = [
    { id: "shoot", emoji: "📸", label: "Shoot" },
    { id: "reels", emoji: "🎬", label: "Reels" },
    { id: "edit", emoji: "✂️", label: "Edit" },
  ];

  const shootCategories = ["All Categories", "Wedding", "Portrait", "Events", "Travel", "Commercial", "Fashion", "Videography", "Drone"];
  const reelCategories = ["All Reel Types", "Instagram Reels", "YouTube Shorts", "TikTok", "Product Showcase", "Brand Story"];
  const editCategories = ["All Edit Types", "Photo Retouching", "Color Grading", "Video Editing", "Reel Editing", "Background Removal", "AI Enhancement"];

  const getCategories = () => {
    if (search.tab === "reels") return reelCategories;
    if (search.tab === "edit") return editCategories;
    return shootCategories;
  };

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <img src="https://picsum.photos/seed/dark-camera-studio/1920/1080" alt="Photography background" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(2,6,23,0.82) 0%,rgba(15,23,42,0.65) 35%,rgba(15,23,42,0.55) 60%,rgba(2,6,23,0.78) 100%)" }} />
      </div>
      <div style={{ position: "absolute", top: 80, right: 40, width: 288, height: 288, background: "rgba(217,119,6,0.1)", borderRadius: "50%", filter: "blur(48px)" }} />
      <div style={{ position: "absolute", bottom: 80, left: 40, width: 384, height: 384, background: "rgba(37,99,235,0.05)", borderRadius: "50%", filter: "blur(48px)" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 896, margin: "0 auto", padding: "80px 24px 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "8px 16px", marginBottom: 32 }}>
          <span style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: "50%", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em" }}>Now with Reels & AI-Powered Matching</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, animation: "fadeInUp 0.7s ease-out forwards" }}>
          Find Your Perfect<br />
          <span style={{ background: "linear-gradient(135deg,#FBBF24 0%,#F59E0B 40%,#D97706 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Creative Professional
          </span>
        </h1>

        <p style={{ fontSize: "clamp(1rem,2vw,1.25rem)", color: "rgba(255,255,255,0.8)", maxWidth: 640, margin: "0 auto 16px", lineHeight: 1.6 }}>
          Photographers • Videographers • Reel Creators • Editors
        </p>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Book talent for weddings, social media, commercial shoots, or get your photos & videos professionally edited.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onSearchChange({ ...search, tab: tab.id, submitted: false });
                setLocalCategory("All Categories");
                setLocalCategory("All Reel Types");
                setLocalCategory("All Edit Types");
              }}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                border: search.tab === tab.id ? "none" : "1px solid rgba(255,255,255,0.2)",
                background: search.tab === tab.id ? "#0f172a" : "rgba(255,255,255,0.1)",
                color: search.tab === tab.id ? "#fff" : "rgba(255,255,255,0.7)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 25px 50px rgba(0,0,0,0.25)", padding: 8, maxWidth: 672, margin: "0 auto" }}>
          {search.tab === "shoot" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "stretch" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, minWidth: 140 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input
                  type="text"
                  value={localCity}
                  onChange={e => setLocalCity(e.target.value)}
                  placeholder="Search by city..."
                  style={{ flex: 1, fontSize: 14, color: "#0f172a", border: "none", outline: "none", background: "transparent" }}
                  onKeyDown={e => { if (e.key === "Enter") handleSearch("shoot"); }}
                />
              </div>
              <div style={{ width: 1, background: "#e2e8f0", alignSelf: "stretch" }} />
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, minWidth: 140 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <select
                  value={localCategory}
                  onChange={e => setLocalCategory(e.target.value)}
                  style={{ flex: 1, fontSize: 14, color: "#64748b", border: "none", outline: "none", background: "transparent", cursor: "pointer" }}
                >
                  {shootCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={() => handleSearch("shoot")} style={{ background: "#d97706", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Search
              </button>
            </div>
          )}
          {search.tab === "reels" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "stretch" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, minWidth: 140 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input
                  type="text"
                  value={localCity}
                  onChange={e => setLocalCity(e.target.value)}
                  placeholder="Your city..."
                  style={{ flex: 1, fontSize: 14, color: "#0f172a", border: "none", outline: "none", background: "transparent" }}
                  onKeyDown={e => { if (e.key === "Enter") handleSearch("reels"); }}
                />
              </div>
              <div style={{ width: 1, background: "#e2e8f0", alignSelf: "stretch" }} />
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, minWidth: 140 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/></svg>
                <select
                  value={localCategory}
                  onChange={e => setLocalCategory(e.target.value)}
                  style={{ flex: 1, fontSize: 14, color: "#64748b", border: "none", outline: "none", background: "transparent", cursor: "pointer" }}
                >
                  {reelCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={() => handleSearch("reels")} style={{ background: "#d97706", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
                Find Creators
              </button>
            </div>
          )}
          {search.tab === "edit" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "stretch" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, minWidth: 140 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <input
                  type="text"
                  value={localCity}
                  onChange={e => setLocalCity(e.target.value)}
                  placeholder="Your city..."
                  style={{ flex: 1, fontSize: 14, color: "#0f172a", border: "none", outline: "none", background: "transparent" }}
                  onKeyDown={e => { if (e.key === "Enter") handleSearch("edit"); }}
                />
              </div>
              <div style={{ width: 1, background: "#e2e8f0", alignSelf: "stretch" }} />
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, minWidth: 140 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="m15 4-8 8 8 8"/><path d="m5 12h14"/></svg>
                <select
                  value={localCategory}
                  onChange={e => setLocalCategory(e.target.value)}
                  style={{ flex: 1, fontSize: 14, color: "#64748b", border: "none", outline: "none", background: "transparent", cursor: "pointer" }}
                >
                  {editCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={() => handleSearch("edit")} style={{ background: "#d97706", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
                Find Editors
              </button>
            </div>
          )}
        </div>

        {/* Active search indicator */}
        {search.submitted && search.city && (
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              Showing results for: <strong style={{ color: "#fbbf24" }}>{search.city}</strong>
              {search.category && !search.category.startsWith("All") && (
                <> • <strong style={{ color: "#fbbf24" }}>{search.category}</strong></>
              )}
            </span>
            <button
              onClick={() => {
                onSearchChange({ city: "", category: "All Categories", tab: search.tab, submitted: false });
                setLocalCity("");
                setLocalCategory("All Categories");
              }}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 999,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <X style={{ width: 10, height: 10 }} /> Clear
            </button>
          </div>
        )}

        <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>AI-powered matching finds the best fit for your project</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "500+", label: "Photographers" },
    { value: "200+", label: "Reel Creators" },
    { value: "150+", label: "Editors" },
    { value: "50+", label: "Cities" },
    { value: "4.9", label: "Avg Rating", highlight: true },
  ];
  return (
    <section style={{ background: "#0f172a", borderTop: "1px solid #1e293b", borderBottom: "1px solid #1e293b" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 32, textAlign: "center" }}>
          {stats.map((s) => (
            <FadeSection key={s.label}>
              <div style={{ fontSize: "clamp(1.5rem,3vw,1.875rem)", fontWeight: 700, color: s.highlight ? "#f59e0b" : "#fff", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{s.label}</div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Photographer Card ────────────────────────────────────────────────────────


interface PhotographerCardProps {
  slug?: string; // <-- ADD THIS
  imgSeed: string;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  tags: string[];
  price: string;
  topRated?: boolean;
  aiPick?: boolean;
  isNew?: boolean;
  verified?: boolean;
  onViewProfile: () => void;
}

function PhotographerCard({ slug, imgSeed, name, city, rating, reviews, tags, price, topRated, aiPick, isNew, verified, onViewProfile }: PhotographerCardProps) {
  const [liked, setLiked] = useState(false);
  const { status } = useSession();        // ← ADD
  const router = useRouter();              // ← ADD
  const handleViewProfile = (e: React.MouseEvent) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      router.push(`/login?callbackUrl=${encodeURIComponent(`/photographers/${slug}`)}`);
    }
  };
  return (
    <FadeSection>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", cursor: "pointer", transition: "all 0.3s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#f1f5f9"; }}
      >
        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* Use real image if it's a URL, otherwise use picsum with imgSeed */}
          <img 
            src={imgSeed.startsWith("http") || imgSeed.startsWith("/") ? imgSeed : `https://picsum.photos/seed/${imgSeed}/600/750`} 
            alt={name} 
            style={{ width: "100%", height: 288, objectFit: "cover", transition: "transform 0.5s ease" }}
            onMouseEnter={e => (e.target as HTMLImageElement).style.transform = "scale(1.08)"}
            onMouseLeave={e => (e.target as HTMLImageElement).style.transform = "scale(1)"}
          />
          <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "#94a3b8"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
          <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 6 }}>
            {topRated && <span style={{ padding: "4px 10px", background: "#d97706", color: "#fff", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderRadius: 6 }}>Top Rated</span>}
            {aiPick && <span style={{ padding: "4px 8px", background: "#7c3aed", color: "#fff", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>✦ AI Pick</span>}
            {isNew && <span style={{ padding: "4px 10px", background: "#059669", color: "#fff", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderRadius: 6 }}>New</span>}
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <h3 style={{ fontWeight: 600, color: "#0f172a", margin: 0 }}>{name}</h3>
            {verified && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{ fontSize: 12, color: "#64748b" }}>{city || "India"}</span>
            <span style={{ color: "#cbd5e1", margin: "0 4px" }}>•</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#334155" }}>{rating}</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>({reviews})</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {tags.map((tag, i) => (
              <span key={tag} style={{ padding: "2px 8px", background: i === 0 ? "#fffbeb" : "#f8fafc", color: i === 0 ? "#b45309" : "#475569", fontSize: 10, fontWeight: 500, borderRadius: 6 }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
            <div>
              <span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Starting</span>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>₹{price}</div>
            </div>
            {/* USE THE REAL SLUG HERE! */}
<a 
  href={`/photographers/${slug}`} 
  onClick={handleViewProfile}
  style={{ padding: "8px 16px", background: "#0f172a", color: "#fff", fontSize: 12, fontWeight: 600, borderRadius: 8, border: "none", cursor: "pointer", textDecoration: "none", display: "inline-block" }}
>
  View Profile
</a>          </div>
        </div>
      </div>
    </FadeSection>
  );
}

// ✅ NEW - Accepts both props
function PhotographersSection({ search, showToast }: { search: SearchState; showToast: (msg: string) => void }) {  const [dbPhotographers, setDbPhotographers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real professionals from database
  useEffect(() => {
    fetch("/api/professionals")
      .then(res => res.json())
      .then(data => {
        setDbPhotographers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Format DB data to match the UI card shape
  const realFormatted = dbPhotographers.map(p => ({
    slug: p.slug,
    imgSeed: p.image || (p.portfolios?.[0]?.imageUrl) || "default-pro",
    name: p.name,
    city: p.city,
    rating: p.rating,
    reviews: p.reviews,
    tags: p.tags ? p.tags.split(",").map((t:string) => t.trim()) : ["Photographer"],
    price: p.price ? p.price.toLocaleString() : "0",
    verified: p.verified,
  }));

  // Fallback dummy data (so the page looks good even if DB is empty)
  const dummyData = [
    { slug: "rahul-sharma", imgSeed: "rahul-photo", name: "Rahul Sharma", city: "Jaipur", rating: 4.8, reviews: 127, tags: ["Wedding", "Pre-Wedding"], price: "15,000", topRated: true, aiPick: true, verified: true },
    { slug: "priya-patel", imgSeed: "priya-portrait", name: "Priya Patel", city: "Mumbai", rating: 4.9, reviews: 89, tags: ["Portrait", "Fashion"], price: "12,000", verified: true },
    { slug: "arjun-mehta", imgSeed: "arjun-events", name: "Arjun Mehta", city: "Delhi", rating: 4.7, reviews: 64, tags: ["Events", "Corporate"], price: "20,000" },
    { slug: "kavita-singh", imgSeed: "kavita-travel", name: "Kavita Singh", city: "Udaipur", rating: 4.8, reviews: 45, tags: ["Travel", "Drone"], price: "18,000", isNew: true },
  ];

  // Combine real DB users with dummy data. 
  // Put REAL users first so you can see your newly created account immediately!
  const realSlugs = new Set(realFormatted.map(p => p.slug));
const filteredDummy = dummyData.filter(p => !realSlugs.has(p.slug));
const allPhotographers = [...realFormatted, ...filteredDummy];

  // Filter by search
  const filtered = allPhotographers.filter(p => {
    let match = true;
    if (search.submitted && search.city) {
      match = match && p.city.toLowerCase().includes(search.city.toLowerCase());
    }
    if (search.submitted && search.category && search.category !== "All Categories") {
      match = match && p.tags.some((t: string) => t.toLowerCase() === search.category.toLowerCase());    }
    return match;
  });

  const showEmpty = search.submitted && search.city && filtered.length === 0;

  return (
    <section id="photographers" style={{ padding: "80px 0", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <FadeSection>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#d97706", display: "block", marginBottom: 12 }}>Featured</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.875rem,4vw,2.25rem)", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Top-Rated Photographers
                  {search.submitted && search.city && (
                    <span style={{ fontSize: 16, fontWeight: 400, color: "#64748b", marginLeft: 8 }}>
                      in <span style={{ color: "#d97706", fontWeight: 600 }}>{search.city}</span>
                    </span>
                  )}
                </h2>
              </div>
              <a href="/photographers" style={{ fontSize: 14, fontWeight: 500, color: "#d97706", textDecoration: "none", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                View all →
              </a>
            </div>
          </div>
        </FadeSection>

        {showEmpty ? (
          <EmptyCityState city={search.city} type="photographers" />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 24 }}>
            {filtered.map(p => (
              <PhotographerCard key={p.slug} {...p} onViewProfile={() => {}} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Reel Card ────────────────────────────────────────────────────────────────
function ReelCard({ imgSeed, name, city, rating, reelCount, specialties, price, aiMatch, topCreator, verified }: {
  imgSeed: string; name: string; city: string; rating: number; reelCount: string;
  specialties: { label: string; color: string }[]; price: string;
  aiMatch?: boolean; topCreator?: boolean; verified?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeSection>
      <div style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div style={{ position: "relative", aspectRatio: "9/16", borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
          <img src={`https://picsum.photos/seed/${imgSeed}/400/710`} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.5s" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }}>
            <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.3)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>{rating}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>• {reelCount} reels</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {specialties.map(s => <span key={s.label} style={{ padding: "2px 8px", background: s.color, color: "#fff", fontSize: 9, fontWeight: 600, borderRadius: 4 }}>{s.label}</span>)}
            </div>
          </div>
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            {aiMatch && <span style={{ padding: "4px 8px", background: "rgba(124,58,237,0.9)", backdropFilter: "blur(4px)", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>✦ AI Match</span>}
            {topCreator && <span style={{ padding: "4px 8px", background: "rgba(217,119,6,0.9)", backdropFilter: "blur(4px)", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 6 }}>Top Creator</span>}
          </div>
        </div>
        <div style={{ padding: "0 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{name}</h4>
            {verified && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{ fontSize: 12 }}>{city}</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: "#f59e0b" }}>₹{price}<span style={{ fontSize: 10, fontWeight: 400, color: "#64748b" }}> / reel</span></div>
        </div>
      </div>
    </FadeSection>
  );
}

// ─── Reels Section ────────────────────────────────────────────────────────────
function ReelsSection({ search }: { search: SearchState }) {
  const allCreators = [
    { imgSeed: "reel-creator-1", name: "Aisha Khan", city: "Mumbai", rating: 4.9, reelCount: "200+", specialties: [{ label: "IG Reels", color: "rgba(236,72,153,0.8)" }, { label: "YT Shorts", color: "rgba(255,255,255,0.2)" }], price: "5,000", aiMatch: true, verified: true },
    { imgSeed: "reel-creator-2", name: "Rohan Verma", city: "Delhi", rating: 4.8, reelCount: "150+", specialties: [{ label: "TikTok", color: "rgba(6,182,212,0.8)" }, { label: "IG Reels", color: "rgba(236,72,153,0.8)" }], price: "4,000" },
    { imgSeed: "reel-creator-3", name: "Sneha Iyer", city: "Bangalore", rating: 5.0, reelCount: "80+", specialties: [{ label: "Product", color: "rgba(245,158,11,0.8)" }, { label: "Brand", color: "rgba(16,185,129,0.8)" }], price: "8,000", topCreator: true, verified: true },
    { imgSeed: "reel-creator-4", name: "Dev Rathore", city: "Jaipur", rating: 4.7, reelCount: "120+", specialties: [{ label: "Fashion", color: "rgba(139,92,246,0.8)" }, { label: "IG Reels", color: "rgba(236,72,153,0.8)" }], price: "6,000" },
    { imgSeed: "reel-creator-5", name: "Meera Reddy", city: "Hyderabad", rating: 4.9, reelCount: "300+", specialties: [{ label: "Food", color: "rgba(249,115,22,0.8)" }, { label: "Restaurant", color: "rgba(239,68,68,0.8)" }], price: "3,500", aiMatch: true, verified: true },
  ];

  // Map UI categories to specialty labels for filtering
  const categoryToSpecialty: Record<string, string[]> = {
    "Instagram Reels": ["IG Reels"],
    "YouTube Shorts": ["YT Shorts"],
    "TikTok": ["TikTok"],
    "Product Showcase": ["Product"],
    "Brand Story": ["Brand"],
  };

  const filtered = allCreators.filter(c => {
    let match = true;
    if (search.submitted && search.city) {
      match = match && c.city.toLowerCase().includes(search.city.toLowerCase());
    }
    if (search.submitted && search.category && search.category !== "All Reel Types") {
      const targetLabels = categoryToSpecialty[search.category] || [search.category];
      match = match && c.specialties.some(s => targetLabels.includes(s.label));
    }
    return match;
  });

  const showEmpty = search.submitted && search.city && filtered.length === 0;

  const services = [
    { icon: "🎬", label: "Reel Shoot + Edit", sub: "Full production", color: "#f472b6" },
    { icon: "🎞", label: "Reel Edit Only", sub: "You shoot, we edit", color: "#22d3ee" },
    { icon: "🎥", label: "Trending Templates", sub: "Viral-ready formats", color: "#fbbf24" },
    { icon: "#", label: "Content Strategy", sub: "AI-powered planning", color: "#a78bfa" },
  ];

  return (
    <section id="reels" style={{ padding: "80px 0", background: "#020617", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 500, height: 500, background: "rgba(217,119,6,0.05)", borderRadius: "50%", filter: "blur(48px)", transform: "translate(33%,-50%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 400, height: 400, background: "rgba(124,58,237,0.05)", borderRadius: "50%", filter: "blur(48px)", transform: "translate(-33%,33%)" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <FadeSection>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 48 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#f59e0b" }}>New</span>
                <span style={{ padding: "2px 8px", background: "#d97706", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Reels & Social</span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.875rem,4vw,2.25rem)", fontWeight: 700, color: "#fff", margin: 0 }}>
                Reel Creators
                {search.submitted && search.city && (
                  <span style={{ fontSize: 16, fontWeight: 400, color: "#94a3b8", marginLeft: 8 }}>
                    in <span style={{ color: "#f59e0b", fontWeight: 600 }}>{search.city}</span>
                  </span>
                )}
              </h2>
              <p style={{ color: "#94a3b8", maxWidth: 448, margin: 0, lineHeight: 1.6 }}>Professional reel shoots, TikTok-ready edits, Instagram content creation — find creators who make your brand go viral.</p>
            </div>
            <a href="/photographers?category=reels" style={{ fontSize: 14, fontWeight: 500, color: "#f59e0b", textDecoration: "none", alignSelf: "flex-start" }}>View all creators →</a>
          </div>
        </FadeSection>

        {showEmpty ? (
          <EmptyCityState city={search.city} type="reel creators" />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
            {filtered.map(c => <ReelCard key={c.name} {...c} />)}
          </div>
        )}

        <FadeSection>
          <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}>
            {services.map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 20, textAlign: "center", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"}
              >
                <span style={{ fontSize: 24, display: "block", marginBottom: 8 }}>{s.icon}</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// ─── Editors Section ──────────────────────────────────────────────────────────
const editorSkillClass: Record<EditorSkill["variant"], string> = {
  primary: "bg-amber-50 text-amber-700 font-semibold",
  default: "bg-slate-50 text-slate-600 font-medium",
  ai: "bg-violet-50 text-violet-600 font-medium",
};

function EditorSkillBadge({ skill }: { skill: EditorSkill }) {
  return (
    <span className={`px-2.5 py-1 text-[10px] rounded-md flex items-center gap-1 ${editorSkillClass[skill.variant]}`}>
      {skill.variant === "ai" && <Sparkles className="w-2.5 h-2.5" />}
      {skill.label}
    </span>
  );
}

function EditorBeforeAfter({ imageSeed }: { imageSeed: string }) {
  const src = `https://picsum.photos/seed/${imageSeed}/400/300`;
  return (
    <div className="relative rounded-xl overflow-hidden mb-5 h-36">
      <div className="absolute inset-0 flex">
        <div className="w-1/2 overflow-hidden">
          <img src={src} alt="Before" className="w-full h-full object-cover grayscale brightness-90 contrast-75 saturate-0" />
        </div>
        <div className="w-1/2 overflow-hidden">
          <img src={src} alt="After" className="w-full h-full object-cover saturate-150 contrast-110 brightness-105" />
        </div>
      </div>
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white shadow-lg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center">
        <MoveHorizontal className="w-3.5 h-3.5 text-slate-600" />
      </div>
      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-semibold rounded">BEFORE</span>
      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-amber-600/90 text-white text-[9px] font-semibold rounded">AFTER</span>
    </div>
  );
}

const EDITORS_DATA: EditorData[] = [
  {
    id: 1, name: "Vikram Das", verified: true, rating: 4.9, projectCount: "200+", turnaround: "24hr turnaround",
    avatarSeed: "editor-vikram", imageSeed: "edit-sample-1",
    skills: [{ label: "Color Grading", variant: "primary" }, { label: "Photo Retouch", variant: "default" }, { label: "AI Enhancement", variant: "ai" }],
    stats: [{ value: "500+", label: "Photos" }, { value: "50+", label: "Videos" }, { value: "24h", label: "Delivery" }],
    pricingAmount: "₹100", pricingUnit: "photo",
  },
  {
    id: 2, name: "Nisha Gupta", verified: true, rating: 4.8, projectCount: "150+", turnaround: "48hr turnaround",
    avatarSeed: "editor-nisha", imageSeed: "edit-sample-2",
    skills: [{ label: "Video Editing", variant: "primary" }, { label: "Reel Editing", variant: "default" }, { label: "AI Auto-Edit", variant: "ai" }],
    stats: [{ value: "100+", label: "Videos" }, { value: "80+", label: "Reels" }, { value: "48h", label: "Delivery" }],
    pricingAmount: "₹2,000", pricingUnit: "video",
  },
  {
    id: 3, name: "Amir Sheikh", verified: false, rating: 5.0, projectCount: "90+", turnaround: "12hr turnaround",
    avatarSeed: "editor-amir", imageSeed: "edit-sample-3",
    skills: [{ label: "Retouching", variant: "primary" }, { label: "Bg Removal", variant: "default" }, { label: "AI Enhance", variant: "ai" }],
    stats: [{ value: "800+", label: "Photos" }, { value: "100%", label: "Satisfaction" }, { value: "12h", label: "Delivery" }],
    pricingAmount: "₹80", pricingUnit: "photo",
  },
];

function EditorCard({ editor }: { editor: EditorData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSendProject = () => {
    if (status === "unauthenticated") {
      window.location.href = `/login?callbackUrl=${encodeURIComponent("/editors")}`;
    } else if (status === "authenticated") {
      setModalOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-amber-300">
      <div className="flex items-start gap-4 mb-5">
        <img src={`https://picsum.photos/seed/${editor.avatarSeed}/200/200`} alt={editor.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-slate-900">{editor.name}</h3>
            {editor.verified && <BadgeCheck className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-slate-700">{editor.rating}</span>
            <span className="text-xs text-slate-400">({editor.projectCount} projects)</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-slate-400">
            <Clock className="w-3 h-3" />
            <span className="text-[11px]">{editor.turnaround}</span>
          </div>
        </div>
      </div>
      <EditorBeforeAfter imageSeed={editor.imageSeed} />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {editor.skills.map(skill => <EditorSkillBadge key={skill.label} skill={skill} />)}
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5 py-4 border-y border-slate-100">
        {editor.stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className={`text-lg font-bold ${i === 2 ? "text-amber-600" : "text-slate-900"}`}>{stat.value}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Starting</span>
          <div className="text-lg font-bold text-slate-900">
            {editor.pricingAmount}
            <span className="text-xs font-normal text-slate-400"> / {editor.pricingUnit}</span>
          </div>
        </div>
        <button onClick={handleSendProject} disabled={status === "loading"} className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50">
          <Send className="w-3.5 h-3.5" />
          {status === "loading" ? "..." : "Send Project"}
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-900">Send Project</h2>
                <p className="text-xs text-slate-400 mt-0.5">to {editor.name}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Project Type</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500">
                  <option>Photo Editing</option>
                  <option>Video Editing</option>
                  <option>Color Grading</option>
                  <option>Reel Editing</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Number of Files</label>
                <input type="number" min={1} placeholder="e.g. 50" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Upload Files</label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragging ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-amber-300"}`}
                >
                  <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" id={`file-upload-${editor.id}`} />
                  <label htmlFor={`file-upload-${editor.id}`} className="cursor-pointer">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Drop files here or <span className="text-amber-600">browse</span></p>
                    <p className="text-xs text-slate-400 mt-1">Supports images & videos</p>
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <FileIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-600 flex-1 truncate">{file.name}</span>
                        <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Notes</label>
                <textarea rows={3} placeholder="Describe what you need..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 resize-none" />
              </div>
              <button className="w-full py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors">Send Project Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ NEW
function EditorsSection({ search, showToast }: { search: SearchState; showToast: (msg: string) => void }) {
  // Map UI categories to editor skill labels
  const categoryToSkill: Record<string, string[]> = {
    "Photo Retouching": ["Retouching", "Photo Retouch"],
    "Color Grading": ["Color Grading"],
    "Video Editing": ["Video Editing"],
    "Reel Editing": ["Reel Editing"],
    "Background Removal": ["Bg Removal"],
    "AI Enhancement": ["AI Enhancement", "AI Enhance", "AI Auto-Edit"],
  };

  const filtered = EDITORS_DATA.filter(e => {
    let match = true;
    // Editors are remote, so city filter is informational but we still show all
    // If you want city filtering for editors too, add a `city` field to EditorData
    if (search.submitted && search.category && search.category !== "All Edit Types") {
      const targetLabels = categoryToSkill[search.category] || [search.category];
      match = match && e.skills.some(s => targetLabels.some(t => s.label.toLowerCase().includes(t.toLowerCase())));
    }
    return match;
  });

  // For editors, show empty only if category filter yields nothing
  const showEmpty = search.submitted && search.tab === "edit" && search.category && search.category !== "All Edit Types" && filtered.length === 0;

  return (
    <section id="editors" style={{ padding: "80px 0", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <FadeSection>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#d97706" }}>Professional</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.875rem,4vw,2.25rem)", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Photo & Video Editors
              {search.submitted && search.category && search.category !== "All Edit Types" && (
                <span style={{ fontSize: 16, fontWeight: 400, color: "#64748b", marginLeft: 8 }}>
                  — <span style={{ color: "#d97706", fontWeight: 600 }}>{search.category}</span>
                </span>
              )}
            </h2>
            <p style={{ color: "#64748b", maxWidth: 480, lineHeight: 1.6 }}>Remote editors available worldwide. Fast turnaround, AI-powered tools.</p>
          </div>
        </FadeSection>

        {showEmpty ? (
          <EmptyCityState city={search.city || "this category"} type="editors" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(editor => <EditorCard key={editor.id} editor={editor} />)}
          </div>
        )}
      </div>
    </section>
  );
}
// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: 1, icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, title: "Search & Discover", desc: "Browse photographers, reel creators, or editors by city, category, budget, or style." },
    { n: 2, icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><polyline points="18 8 22 12 18 16"/><polyline points="6 8 2 12 6 16"/><line x1="2" y1="12" x2="22" y2="12"/></svg>, title: "Compare & Choose", desc: "View portfolios, read reviews, compare pricing. AI suggests the best match for your needs." },
    { n: 3, icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>, title: "Book & Relax", desc: "Book instantly, upload files for editing, and get your content delivered on time." },
  ];
  return (
    <section id="how-it-works" style={{ padding: "80px 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#d97706", display: "block", marginBottom: 12 }}>Simple Process</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.875rem,4vw,2.25rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>How Shootly Works</h2>
            <p style={{ color: "#64748b", maxWidth: 448, margin: "0 auto" }}>Three steps to book any creative professional — photographer, reel creator, or editor.</p>
          </div>
        </FadeSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 48 }}>
          {steps.map(s => (
            <FadeSection key={s.n}>
              <div style={{ textAlign: "center", position: "relative" }}>
                <div style={{ width: 80, height: 80, margin: "0 auto 24px", background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  {s.icon}
                  <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", width: 28, height: 28, background: "#d97706", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{s.n}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 280, margin: "0 auto" }}>{s.desc}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Features ──────────────────────────────────────────────────────────────
function AIFeatures() {
  const features = [
    { icon: "🧠", color: "rgba(217,119,6,0.2)", iconColor: "#fbbf24", title: "Smart Matching", desc: "ML algorithm analyzes your requirements, style preferences, and budget to recommend the top 3 best-fit professionals.", status: "Model Training In Progress", dotColor: "#f59e0b" },
    { icon: "👁", color: "rgba(124,58,237,0.2)", iconColor: "#a78bfa", title: "Style Detection", desc: "Upload a reference photo and our CNN model identifies the photography style — moody, bright, cinematic, documentary, and more.", status: "CNN Pipeline Ready", dotColor: "#8b5cf6" },
    { icon: "✦", color: "rgba(16,185,129,0.2)", iconColor: "#34d399", title: "AI Auto-Enhance", desc: "One-click AI enhancement for photos — auto color correction, noise reduction, and upscaling powered by deep learning models.", status: "GAN Model Integrating", dotColor: "#10b981" },
    { icon: "📈", color: "rgba(6,182,212,0.2)", iconColor: "#22d3ee", title: "Fair Price Predictor", desc: "ML model trained on 10K+ bookings predicts fair pricing based on city, category, experience, and demand patterns.", status: "Regression Model Tuning", dotColor: "#06b6d4" },
    { icon: "🎬", color: "rgba(236,72,153,0.2)", iconColor: "#f472b6", title: "Smart Reel Templates", desc: "AI analyzes trending audio & formats on Instagram/TikTok to generate reel templates that are more likely to go viral.", status: "Trend Analysis Active", dotColor: "#ec4899" },
    { icon: "🛡", color: "rgba(249,115,22,0.2)", iconColor: "#fb923c", title: "Auto Quality Check", desc: "Computer vision automatically reviews uploaded portfolios for quality, blur, composition, and flags low-quality uploads.", status: "Vision API Connecting", dotColor: "#f97316" },
  ];

  return (
    <section id="ai-features" style={{ padding: "80px 0", background: "#0f172a", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "rgba(217,119,6,0.05)", borderRadius: "50%", filter: "blur(80px)" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(217,119,6,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 999, padding: "8px 16px", marginBottom: 24 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#fcd34d", letterSpacing: "0.05em" }}>Coming Soon</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.875rem,4vw,2.25rem)", fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>
              AI-Powered{" "}
              <span style={{ background: "linear-gradient(90deg,#D97706 0%,#FBBF24 25%,#F59E0B 50%,#FBBF24 75%,#D97706 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 3s linear infinite" }}>
                Intelligence
              </span>
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: 448, margin: "0 auto" }}>Machine learning that understands your style, predicts the best matches, and automates the boring stuff.</p>
          </div>
        </FadeSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {features.map(f => (
            <FadeSection key={f.title}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, transition: "background 0.2s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"}
              >
                <div style={{ width: 48, height: 48, background: f.color, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 22 }}>
                  <span>{f.icon}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 16px" }}>{f.desc}</p>
                <div style={{ paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, background: f.dotColor, borderRadius: "50%", animation: "pulseSlow 2s infinite" }} />
                  <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{f.status}</span>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} } @keyframes pulseSlow { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </section>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────
function Categories() {
  const cats = [
    { seed: "wedding-cat-v2", label: "Wedding", count: "180+ pros", icon: "❤" },
    { seed: "portrait-cat-v2", label: "Portrait", count: "120+ pros", icon: "👤" },
    { seed: "events-cat-v2", label: "Events", count: "95+ pros", icon: "🎉" },
    { seed: "reel-cat-v2", label: "Reels & Social", count: "200+ creators", icon: "🎞" },
    { seed: "editing-cat-v2", label: "Editing Only", count: "150+ editors", icon: "✦" },
    { seed: "travel-cat-v2", label: "Travel", count: "75+ pros", icon: "⛰" },
    { seed: "fashion-cat-v2", label: "Fashion", count: "60+ pros", icon: "✨" },
    { seed: "commercial-cat-v2", label: "Commercial", count: "45+ pros", icon: "🏢" },
    { seed: "video-cat-v2", label: "Videography", count: "85+ pros", icon: "🎬" },
    { seed: "drone-cat-v2", label: "Drone & Aerial", count: "35+ pros", icon: "✈" },
  ];

  return (
    <section id="categories" style={{ padding: "80px 0", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <FadeSection>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#d97706", display: "block", marginBottom: 12 }}>Browse</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.875rem,4vw,2.25rem)", fontWeight: 700, color: "#0f172a", margin: 0 }}>Explore by Category</h2>
            </div>
            <a href="#" style={{ fontSize: 14, fontWeight: 500, color: "#d97706", textDecoration: "none" }}>All categories →</a>
          </div>
        </FadeSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
          {cats.map(c => (
            <FadeSection key={c.label}>
              <a href="#" style={{ display: "block", position: "relative", height: 240, borderRadius: 16, overflow: "hidden", cursor: "pointer", textDecoration: "none" }}>
                <img src={`https://picsum.photos/seed/${c.seed}/800/600`} alt={c.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                  onMouseEnter={e => (e.target as HTMLImageElement).style.transform = "scale(1.1)"}
                  onMouseLeave={e => (e.target as HTMLImageElement).style.transform = "scale(1)"}
                />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", transition: "background 0.4s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(15,23,42,0.45)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.4)"}
                />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                  <span style={{ fontSize: 24, marginBottom: 8, opacity: 0.8 }}>{c.icon}</span>
                  <h3 style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>{c.label}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, margin: 0 }}>{c.count}</p>
                </div>
              </a>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Learn More Modal ─────────────────────────────────────────────────────────
// FIX 5: Learn More now opens a modal with platform info
function LearnMoreModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const perks = [
    { icon: "🌐", title: "Pan-India Reach", desc: "Get discovered by clients from 50+ cities across India looking for your exact style." },
    { icon: "📅", title: "Easy Booking Management", desc: "Accept, decline, or reschedule bookings from one clean dashboard. No back-and-forth DMs." },
    { icon: "💸", title: "Transparent Payments", desc: "Get paid securely. We handle invoicing, advance collection, and payout — on time, every time." },
    { icon: "🤖", title: "AI Visibility Boost", desc: "Our matching algorithm surfaces your profile to the most relevant clients based on style and budget." },
    { icon: "⭐", title: "Build Your Reputation", desc: "Collect verified reviews, display your portfolio, and earn badges as you complete more bookings." },
    { icon: "🚀", title: "Zero Commission to Start", desc: "Join free and keep 100% of your earnings during the launch period. Grow first, pay later." },
  ];

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.85)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 24, maxWidth: 680, width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative" }}
      >
        {/* Header */}
        <div style={{ padding: "32px 32px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, background: "#d97706", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Shootly for Professionals</span>
            </div>
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>Everything you need to grow your creative business in India.</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, cursor: "pointer", color: "#94a3b8", fontSize: 18, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Perks grid */}
        <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {perks.map(p => (
            <div key={p.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
              <span style={{ fontSize: 24, display: "block", marginBottom: 10 }}>{p.icon}</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ padding: "20px 32px 32px", borderTop: "1px solid #1e293b", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
          <a href="/signup?role=professional" style={{ flex: 1, minWidth: 160, padding: "14px 24px", background: "#d97706", color: "#fff", fontSize: 14, fontWeight: 600, borderRadius: 12, textDecoration: "none", textAlign: "center", display: "block" }}>
            Join Now — It&apos;s Free
          </a>
          <button onClick={onClose} style={{ flex: 1, minWidth: 160, padding: "14px 24px", background: "transparent", color: "#94a3b8", border: "1px solid #1e293b", fontSize: 14, fontWeight: 500, borderRadius: 12, cursor: "pointer" }}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection({ showToast: _showToast }: { showToast: (m: string) => void }) {
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <>
      {showLearnMore && <LearnMoreModal onClose={() => setShowLearnMore(false)} />}
      <section style={{ position: "relative", padding: "96px 0", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src="https://picsum.photos/seed/dark-studio-setup/1920/800" alt="Creative workspace" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.9)" }} />
        </div>
        <FadeSection>
          <div style={{ position: "relative", zIndex: 1, maxWidth: 768, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(217,119,6,0.2)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 999, padding: "8px 16px", marginBottom: 32 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#fcd34d", letterSpacing: "0.05em" }}>For Creative Professionals</span>
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.875rem,5vw,3rem)", fontWeight: 700, color: "#fff", margin: "0 0 24px" }}>Grow Your Creative Business</h2>
            <p style={{ fontSize: 18, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>Whether you shoot, edit, or create reels — Shootly helps you get discovered, manage bookings, and scale your business.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 400, margin: "0 auto 40px" }}>
              {[{ icon: "📷", label: "Photographer" }, { icon: "🎬", label: "Reel Creator" }, { icon: "✦", label: "Editor" }].map(t => (
                <div key={t.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 12px", textAlign: "center", cursor: "pointer" }}>
                  <span style={{ fontSize: 20, display: "block", marginBottom: 8 }}>{t.icon}</span>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{t.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 16 }}>
              {/* FIX 4: Join Shootly redirects to /signup?role=professional */}
              <a href="/signup?role=professional" style={{ padding: "16px 32px", background: "#d97706", color: "#fff", fontSize: 14, fontWeight: 600, borderRadius: 12, border: "none", cursor: "pointer", textDecoration: "none", display: "inline-block" }}>
                Join Shootly — It&apos;s Free
              </a>
              {/* FIX 5: Learn More opens the modal */}
              <button onClick={() => setShowLearnMore(true)} style={{ padding: "16px 32px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", fontSize: 14, fontWeight: 600, borderRadius: 12, cursor: "pointer" }}>
                Learn More
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 32 }}>
              {["Free to join", "0% commission", "AI visibility boost"].map(txt => (
                <span key={txt} style={{ fontSize: 14, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {txt}
                </span>
              ))}
            </div>
          </div>
        </FadeSection>
      </section>
    </>
  );
}
// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShootlyLanding() {
  const { toast, showToast } = useToast();
  const [search, setSearch] = useState<SearchState>({
    city: "",
    category: "All Categories",
    tab: "shoot",
    submitted: false,
  });

  const handleSearchChange = useCallback((newSearch: SearchState) => {
    setSearch(newSearch);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; background: #fff; color: #0f172a; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes pulseSlow { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .shootly-desktop-nav { display: flex; align-items: center; gap: 28px; }
        .shootly-desktop-auth { display: flex; align-items: center; gap: 12px; }
        .shootly-mobile-btn { display: none; }
        @media (max-width: 1024px) {
          .shootly-desktop-nav { display: none; }
          .shootly-desktop-auth { display: none; }
          .shootly-mobile-btn { display: block; }
        }
      `}</style>

      {/* <Navbar /> */}
      <Hero search={search} onSearchChange={handleSearchChange} />
      <StatsBar />
      <PhotographersSection search={search} showToast={showToast} />
      <ReelsSection search={search} />
      <EditorsSection search={search} showToast={showToast} />
      <HowItWorks />
      <AIFeatures />
      <Categories />
      <CTASection showToast={showToast} />
      {/* <Footer /> */}
      <Toast message={toast} />
    </>
  );
}