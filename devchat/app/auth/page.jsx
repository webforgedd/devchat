"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(24,95,165,0.25)",
  borderRadius: "10px",
  color: "#E6F1FB",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.name } },
        });
        if (error) throw error;
        setSuccess("Account created! You can now sign in.");
        setMode("login");
        setForm({ name: "", email: form.email, password: "" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        router.push("/chat");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/chat` },
    });
    if (error) setError(error.message);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#042C53",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "16px",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: "28px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", fontWeight: "800", color: "#E6F1FB", letterSpacing: "-0.03em" }}>
          Dev<span style={{ color: "#185FA5" }}>Chat</span>
        </div>
        <p style={{ color: "rgba(230,241,251,0.4)", fontSize: "0.85rem", marginTop: "4px", marginBottom: 0 }}>
          Your AI-powered developer assistant
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "400px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(24,95,165,0.35)",
        borderRadius: "18px", padding: "32px 28px",
      }}>

        {/* Tab Switcher */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "4px", marginBottom: "24px" }}>
          {["login", "signup"].map((tab) => (
            <button key={tab} onClick={() => { setMode(tab); setError(""); setSuccess(""); }}
              style={{ flex: 1, padding: "9px", border: "none", borderRadius: "7px", cursor: "pointer", fontWeight: "600", fontSize: "0.875rem", background: mode === tab ? "#185FA5" : "transparent", color: mode === tab ? "#ffffff" : "rgba(230,241,251,0.4)", transition: "all 0.2s" }}>
              {tab === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <h1 style={{ color: "#E6F1FB", fontSize: "1.4rem", fontWeight: "700", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          {mode === "login" ? "Welcome back 👋" : "Create your account"}
        </h1>
        <p style={{ color: "rgba(230,241,251,0.4)", fontSize: "0.85rem", marginTop: 0, marginBottom: "24px" }}>
          {mode === "login" ? "Sign in to continue to DevChat" : "Start with 20 free messages per day"}
        </p>

        {/* Error */}
        {error && (
          <div style={{ padding: "10px 14px", marginBottom: "16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", color: "#ef4444", fontSize: "0.82rem" }}>
            ❌ {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{ padding: "10px 14px", marginBottom: "16px", background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "10px", color: "#1D9E75", fontSize: "0.82rem" }}>
            ✅ {success}
          </div>
        )}

        {/* GitHub */}
        <button onClick={handleGitHub} style={{ width: "100%", padding: "11px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#E6F1FB", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#E6F1FB">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
          </svg>
          Continue with GitHub
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "rgba(230,241,251,0.3)", fontSize: "0.8rem" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "signup" && (
            <div>
              <label style={{ display: "block", color: "rgba(230,241,251,0.6)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "6px" }}>Full Name</label>
              <input name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required style={inputStyle} />
            </div>
          )}

          <div>
            <label style={{ display: "block", color: "rgba(230,241,251,0.6)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "6px" }}>Email</label>
            <input name="email" type="email" placeholder="dev@example.com" value={form.email} onChange={handleChange} required style={inputStyle} />
          </div>

          <div>
           
            <div style={{ position: "relative" }}>
              <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} style={{ ...inputStyle, paddingRight: "50px" }} />
              <button type="button" onClick={() => setShowPassword((v) => !v)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(230,241,251,0.4)", cursor: "pointer", fontSize: "0.78rem", fontWeight: "600", padding: 0 }}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "12px", background: loading ? "rgba(24,95,165,0.5)" : "#185FA5", border: "none", borderRadius: "10px", color: "#fff", fontSize: "0.925rem", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginTop: "4px", transition: "background 0.2s" }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "rgba(230,241,251,0.4)", fontSize: "0.85rem", marginTop: "20px", marginBottom: 0 }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
            style={{ background: "none", border: "none", color: "#185FA5", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", padding: 0 }}>
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>

        {mode === "signup" && (
          <div style={{ marginTop: "16px", padding: "10px 14px", background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "10px", textAlign: "center", color: "#1D9E75", fontSize: "0.8rem", fontWeight: "600" }}>
            ⚡ Free plan includes 20 messages/day
          </div>
        )}
      </div>
    </div>
  );
}