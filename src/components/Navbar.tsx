"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation"; //

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  const textColor = (isHome && !scrolled) ? "#ffffff" : "#0f172a";
  const linkColor = (isHome && !scrolled) ? "rgba(255,255,255,0.8)" : "#475569";

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: (isHome && !scrolled) ? "transparent" : "#ffffff",
    boxShadow: (isHome && !scrolled) ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
    borderBottom: (isHome && !scrolled) ? "none" : "1px solid #f1f5f9",
    transition: "all 0.3s",
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
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

        {/* ── AUTH BUTTONS (Dynamic) ── */}
        <div className="shootly-desktop-auth" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {status === "authenticated" ? (
            <>
              {session.user?.role === "PROFESSIONAL" && (
                <a href="/dashboard" style={{ fontSize: 14, fontWeight: 500, color: linkColor, textDecoration: "none", padding: "8px 16px" }}>Dashboard</a>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{ fontSize: 14, fontWeight: 500, background: "#0f172a", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={{ fontSize: 14, fontWeight: 500, color: linkColor, textDecoration: "none", padding: "8px 16px", display: "inline-block" }}>Log in</a>
              <a href="/signup" style={{ fontSize: 14, fontWeight: 500, background: "#d97706", color: "#fff", textDecoration: "none", padding: "10px 20px", borderRadius: 8, display: "inline-block" }}>Sign up</a>
            </>
          )}
        </div>

        {/* ── MOBILE MENU ── */}
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
            
            {status === "authenticated" ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{ background: "#0f172a", color: "#fff", fontSize: 14, fontWeight: 500, border: "none", padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center" }}
              >
                Log out
              </button>
            ) : (
              <>
                <a href="/login" style={{ fontSize: 14, fontWeight: 500, color: "#334155", textDecoration: "none", padding: "10px 12px", display: "block" }}>Log in</a>
                <a href="/signup" style={{ background: "#d97706", color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "10px 12px", borderRadius: 8, display: "block", textAlign: "center" }}>Sign up</a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}