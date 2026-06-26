"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to login page on success
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020617", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, background: "#d97706", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Shootly</span>
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Create your account</h1>
          <p style={{ fontSize: 15, color: "#94a3b8" }}>Join India's fastest-growing creative platform</p>
        </div>

        {/* Form Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: 12, fontSize: 14, marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Name */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Rahul Sharma" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 15, color: "#0f172a", outline: "none", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = "#d97706"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="rahul@example.com" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 15, color: "#0f172a", outline: "none", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = "#d97706"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} placeholder="Min. 6 characters" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 15, color: "#0f172a", outline: "none", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = "#d97706"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            {/* Role Selector */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>I am a...</label>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setFormData({ ...formData, role: "CLIENT" })} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, border: formData.role === "CLIENT" ? "2px solid #d97706" : "1px solid #e2e8f0", background: formData.role === "CLIENT" ? "#fffbeb" : "#fff", color: formData.role === "CLIENT" ? "#b45309" : "#475569", fontSize: 14, fontWeight: formData.role === "CLIENT" ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}>
                  😊 Client<br /><span style={{ fontSize: 11, fontWeight: 400 }}>Looking to hire</span>
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, role: "PROFESSIONAL" })} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, border: formData.role === "PROFESSIONAL" ? "2px solid #d97706" : "1px solid #e2e8f0", background: formData.role === "PROFESSIONAL" ? "#fffbeb" : "#fff", color: formData.role === "PROFESSIONAL" ? "#b45309" : "#475569", fontSize: 14, fontWeight: formData.role === "PROFESSIONAL" ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}>
                  📸 Professional<br /><span style={{ fontSize: 11, fontWeight: 400 }}>Offering services</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 24px", background: loading ? "#92400e" : "#d97706", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "background 0.2s" }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <span style={{ fontSize: 14, color: "#64748b" }}>Already have an account? </span>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: "#d97706", textDecoration: "none" }}>Log in</Link>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#475569", marginTop: 24 }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}