"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const updatePro = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Update user metadata to mark as Pro
        await supabase.auth.updateUser({
          data: { is_pro: true }
        });
      }
      setLoading(false);
    };
    updatePro();
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#042C53",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "16px",
    }}>
      <div style={{
        width: "100%", maxWidth: "400px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(29,158,117,0.35)",
        borderRadius: "18px", padding: "40px 28px",
        textAlign: "center",
      }}>
        {loading ? (
          <div style={{ color: "rgba(230,241,251,0.5)" }}>Setting up your Pro account...</div>
        ) : (
          <>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
            <h1 style={{ color: "#E6F1FB", fontSize: "1.6rem", fontWeight: "800", marginBottom: "8px", letterSpacing: "-0.02em" }}>
              Welcome to Pro!
            </h1>
            <p style={{ color: "rgba(230,241,251,0.45)", fontSize: "0.9rem", marginBottom: "8px", lineHeight: 1.6 }}>
              Your DevChat Pro subscription is now active.
            </p>

            <div style={{
              margin: "20px 0",
              padding: "16px",
              background: "rgba(29,158,117,0.1)",
              border: "1px solid rgba(29,158,117,0.2)",
              borderRadius: "12px",
            }}>
              {["Unlimited messages", "Full chat history", "Priority AI responses", "Advanced code features"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: i < 3 ? "8px" : 0 }}>
                  <span style={{ color: "#1D9E75" }}>✓</span>
                  <span style={{ color: "rgba(230,241,251,0.7)", fontSize: "0.875rem" }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/chat")}
              style={{
                width: "100%", padding: "12px",
                background: "#185FA5", border: "none",
                borderRadius: "10px", color: "#fff",
                fontSize: "0.925rem", fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Start Chatting → 🚀
            </button>
          </>
        )}
      </div>
    </div>
  );
}