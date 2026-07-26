"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Check, Zap, Crown, ArrowLeft } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    desc: "Perfect for getting started",
    color: "#185FA5",
    icon: Zap,
    features: ["20 messages per day", "Gemini AI responses", "Basic code support", "Web access", "Email support"],
    notIncluded: ["Unlimited messages", "Chat history", "Priority responses"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "9",
    desc: "For serious developers",
    color: "#1D9E75",
    icon: Crown,
    features: ["Unlimited messages", "Priority AI responses", "Full chat history", "Advanced code features", "Early access to new tools", "Priority email support", "No daily limits ever"],
    notIncluded: [],
    cta: "Upgrade to Pro",
    highlight: true,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/auth");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating checkout session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#042C53",
      fontFamily: "'Segoe UI', sans-serif", color: "#E6F1FB", padding: "0 16px",
    }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(24,95,165,0.12) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto", padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => router.push("/chat")}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "rgba(230,241,251,0.5)", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600" }}>
          <ArrowLeft size={16} /> Back to Chat
        </button>
        <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "#E6F1FB" }}>
          Dev<span style={{ color: "#185FA5" }}>Chat</span>
        </div>
      </nav>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "40px 0 50px" }}>
        <div style={{ display: "inline-block", background: "rgba(29,158,117,0.12)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "20px", padding: "5px 16px", color: "#1D9E75", fontSize: "0.78rem", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
          Simple Pricing
        </div>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "800", color: "#E6F1FB", margin: "0 0 12px", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
          Start free.<br />
          <span style={{ color: "#185FA5" }}>Scale when ready.</span>
        </h1>
        <p style={{ color: "rgba(230,241,251,0.45)", fontSize: "1rem", maxWidth: "400px", margin: "0 auto", lineHeight: 1.6 }}>
          No credit card needed. No hidden fees. Cancel anytime.
        </p>
      </div>

      {/* Cards */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: "720px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", paddingBottom: "60px" }}>
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div key={plan.name} style={{
              position: "relative",
              background: plan.highlight ? "linear-gradient(145deg, rgba(24,95,165,0.2), rgba(4,44,83,0.8))" : "rgba(255,255,255,0.03)",
              border: `1px solid ${plan.highlight ? "#185FA5" : "rgba(24,95,165,0.2)"}`,
              borderRadius: "20px", padding: "32px 28px",
              display: "flex", flexDirection: "column", gap: "24px",
              boxShadow: plan.highlight ? "0 0 60px rgba(24,95,165,0.15)" : "none",
            }}>
              {plan.highlight && (
                <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #1D9E75, #16855f)", color: "white", fontSize: "0.72rem", fontWeight: "800", padding: "4px 16px", borderRadius: "20px", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  ⚡ Most Popular
                </div>
              )}

              <div>
                <div style={{ width: "44px", height: "44px", background: `${plan.color}22`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <Icon size={22} style={{ color: plan.color }} />
                </div>
                <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "rgba(230,241,251,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.9rem", color: "rgba(230,241,251,0.5)", marginBottom: "6px" }}>$</span>
                  <span style={{ fontSize: "3rem", fontWeight: "800", color: "#E6F1FB", lineHeight: 1, letterSpacing: "-0.03em" }}>{plan.price}</span>
                  <span style={{ fontSize: "0.85rem", color: "rgba(230,241,251,0.4)", marginBottom: "8px" }}>{plan.price === "0" ? "/ forever" : "/ month"}</span>
                </div>
                <p style={{ color: "rgba(230,241,251,0.4)", fontSize: "0.85rem", margin: 0 }}>{plan.desc}</p>
              </div>

              {/* CTA */}
              <button
                onClick={() => plan.highlight ? handleUpgrade() : router.push("/auth")}
                disabled={loading && plan.highlight}
                style={{
                  width: "100%", padding: "13px",
                  background: plan.highlight ? "linear-gradient(135deg, #185FA5, #1a6bbf)" : "rgba(255,255,255,0.05)",
                  border: plan.highlight ? "none" : "1px solid rgba(24,95,165,0.3)",
                  borderRadius: "12px",
                  color: plan.highlight ? "#ffffff" : "rgba(230,241,251,0.7)",
                  fontSize: "0.925rem", fontWeight: "700",
                  cursor: loading && plan.highlight ? "not-allowed" : "pointer",
                  opacity: loading && plan.highlight ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {loading && plan.highlight ? "Redirecting..." : `${plan.cta} ${plan.highlight ? "→" : ""}`}
              </button>

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "0.78rem", color: "rgba(230,241,251,0.3)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>What's included</div>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: `${plan.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={11} style={{ color: plan.color }} />
                    </div>
                    <span style={{ color: "rgba(230,241,251,0.75)", fontSize: "0.875rem" }}>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", opacity: 0.35 }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.6rem", color: "rgba(230,241,251,0.3)" }}>✕</span>
                    </div>
                    <span style={{ color: "rgba(230,241,251,0.4)", fontSize: "0.875rem", textDecoration: "line-through" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: "600px", margin: "0 auto", paddingBottom: "60px" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "700", color: "#E6F1FB", marginBottom: "28px", letterSpacing: "-0.02em" }}>Common questions</h2>
        {[
          { q: "Can I cancel anytime?", a: "Yes! Cancel anytime — no questions asked. You keep Pro access until end of billing period." },
          { q: "What happens when I hit the free limit?", a: "Your messages reset every day at midnight. Upgrade to Pro for unlimited messages." },
          { q: "Is my data private?", a: "Yes. We never train AI on your conversations or sell your data to anyone." },
          { q: "Which AI model powers DevChat?", a: "DevChat is powered by Google Gemini — one of the fastest and most capable AI models available." },
        ].map((item, i) => (
          <div key={i} style={{ padding: "18px 20px", marginBottom: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(24,95,165,0.15)", borderRadius: "12px" }}>
            <div style={{ color: "#E6F1FB", fontWeight: "600", fontSize: "0.9rem", marginBottom: "6px" }}>{item.q}</div>
            <div style={{ color: "rgba(230,241,251,0.45)", fontSize: "0.85rem", lineHeight: 1.6 }}>{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}