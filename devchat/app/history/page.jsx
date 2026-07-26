"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function HistoryPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth"); return; }
      setUser(session.user);

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: true });

      if (!error) setMessages(data || []);
      setLoading(false);
    };
    loadHistory();
  }, [router]);

  const clearHistory = async () => {
    if (!confirm("Delete all chat history?")) return;
    await supabase.from("messages").delete().eq("user_id", user.id);
    setMessages([]);
  };

  // Group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const date = new Date(msg.created_at).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ height: "100vh", background: "#042C53", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(230,241,251,0.5)" }}>Loading history...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#042C53", fontFamily: "'Segoe UI', sans-serif", color: "#E6F1FB" }}>

      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(24,95,165,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(4,44,83,0.95)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => router.push("/chat")}
            style={{ background: "none", border: "none", color: "rgba(230,241,251,0.5)", cursor: "pointer", fontSize: "1.2rem", padding: 0 }}>
            ←
          </button>
          <div>
            <div style={{ color: "#E6F1FB", fontWeight: "700", fontSize: "1rem" }}>Dev<span style={{ color: "#185FA5" }}>Chat</span></div>
            <div style={{ color: "rgba(230,241,251,0.4)", fontSize: "0.72rem" }}>Chat History</div>
          </div>
        </div>

        {messages.length > 0 && (
          <button onClick={clearHistory}
            style={{ padding: "5px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "20px", color: "#ef4444", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer" }}>
            🗑️ Clear History
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 16px" }}>

        {messages.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💬</div>
            <h2 style={{ color: "#E6F1FB", fontSize: "1.3rem", fontWeight: "700", marginBottom: "8px" }}>No history yet</h2>
            <p style={{ color: "rgba(230,241,251,0.4)", fontSize: "0.875rem", marginBottom: "24px" }}>
              Start chatting to see your history here!
            </p>
            <button onClick={() => router.push("/chat")}
              style={{ padding: "10px 24px", background: "#185FA5", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "700", cursor: "pointer" }}>
              Go to Chat →
            </button>
          </div>
        ) : (
          Object.entries(grouped).reverse().map(([date, msgs]) => (
            <div key={date} style={{ marginBottom: "32px" }}>
              {/* Date header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(24,95,165,0.2)" }} />
                <span style={{ color: "rgba(230,241,251,0.3)", fontSize: "0.75rem", fontWeight: "600", whiteSpace: "nowrap" }}>
                  {date}
                </span>
                <div style={{ flex: 1, height: "1px", background: "rgba(24,95,165,0.2)" }} />
              </div>

              {/* Messages */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {msgs.map((msg) => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "75%", padding: "10px 14px",
                      borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.role === "user" ? "#185FA5" : "rgba(255,255,255,0.04)",
                      border: msg.role === "user" ? "none" : "1px solid rgba(24,95,165,0.2)",
                      color: "#E6F1FB", fontSize: "0.875rem", lineHeight: "1.6",
                      whiteSpace: "pre-wrap", wordBreak: "break-word",
                    }}>
                      {msg.content}
                      <div style={{ fontSize: "0.65rem", color: "rgba(230,241,251,0.3)", marginTop: "4px", textAlign: msg.role === "user" ? "right" : "left" }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}