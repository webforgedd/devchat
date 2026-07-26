"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DAILY_LIMIT = 20;
const STORAGE_KEY = "devchat_usage";

function getUsage() {
  if (typeof window === "undefined") return { count: 0, date: "" };
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const today = new Date().toDateString();
    if (data.date !== today) return { count: 0, date: today };
    return data;
  } catch {
    return { count: 0, date: new Date().toDateString() };
  }
}

function saveUsage(count) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, date: new Date().toDateString() }));
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm DevChat — your AI developer assistant. Ask me anything about code, bugs, architecture, or tech! 🚀" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState({ count: 0, date: "" });
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const bottomRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth"); return; }
      setUser(session.user);
      setCheckingAuth(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.push("/auth");
      else setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => { setUsage(getUsage()); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const saveMessageToDB = async (role, content, userId) => {
    await supabase.from("messages").insert({ user_id: userId, role, content });
  };

  const remaining = DAILY_LIMIT - usage.count;
  const limitReached = remaining <= 0;

  const sendMessage = async () => {
    if (!input.trim() || loading || limitReached) return;

    const userMsg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const newCount = usage.count + 1;
    saveUsage(newCount);
    setUsage({ count: newCount, date: new Date().toDateString() });

    if (user) await saveMessageToDB("user", userMsg.content, user.id);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const assistantMsg = data.reply || "Sorry, something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", content: assistantMsg }]);
      if (user) await saveMessageToDB("assistant", assistantMsg, user.id);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (checkingAuth) {
    return (
      <div style={{ height: "100vh", background: "#042C53", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(230,241,251,0.5)", fontSize: "0.9rem" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", background: "#042C53", display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(24,95,165,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(4,44,83,0.95)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", background: "#185FA5", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>💬</div>
          <div>
            <div style={{ color: "#E6F1FB", fontWeight: "700", fontSize: "1rem" }}>Dev<span style={{ color: "#185FA5" }}>Chat</span></div>
            <div style={{ color: "rgba(230,241,251,0.4)", fontSize: "0.72rem" }}>Powered by Gemini AI</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

          {/* History button */}
          <button onClick={() => router.push("/history")}
            style={{ padding: "5px 12px", background: "rgba(24,95,165,0.15)", border: "1px solid rgba(24,95,165,0.3)", borderRadius: "20px", color: "#E6F1FB", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer" }}>
            📋 History
          </button>

          {/* Upgrade button — always visible */}
          <button onClick={() => router.push("/pricing")}
            style={{ padding: "5px 12px", background: "rgba(29,158,117,0.12)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "20px", color: "#1D9E75", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer" }}>
            ⚡ Upgrade
          </button>

          {/* Usage counter */}
          <div style={{ padding: "5px 12px", background: limitReached ? "rgba(239,68,68,0.15)" : "rgba(29,158,117,0.12)", border: `1px solid ${limitReached ? "rgba(239,68,68,0.3)" : "rgba(29,158,117,0.25)"}`, borderRadius: "20px", color: limitReached ? "#ef4444" : "#1D9E75", fontSize: "0.78rem", fontWeight: "600" }}>
            {limitReached ? "Limit reached" : `⚡ ${remaining}/${DAILY_LIMIT} left`}
          </div>

          {limitReached && (
            <button onClick={() => router.push("/pricing")}
              style={{ padding: "5px 12px", background: "#185FA5", border: "none", borderRadius: "20px", color: "#fff", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer" }}>
              Upgrade →
            </button>
          )}

          {/* Sign out */}
          <button onClick={handleSignOut}
            style={{ padding: "5px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "20px", color: "#ef4444", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer" }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.role === "user" ? "#185FA5" : "rgba(255,255,255,0.05)", border: msg.role === "user" ? "none" : "1px solid rgba(24,95,165,0.2)", color: "#E6F1FB", fontSize: "0.9rem", lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(24,95,165,0.2)", color: "rgba(230,241,251,0.5)", fontSize: "0.9rem" }}>
              Thinking...
            </div>
          </div>
        )}

        {limitReached && (
          <div style={{ padding: "16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", textAlign: "center" }}>
            <div style={{ color: "#ef4444", fontWeight: "700", marginBottom: "8px" }}>Daily limit reached 😔</div>
            <div style={{ color: "rgba(230,241,251,0.5)", marginBottom: "12px", fontSize: "0.82rem" }}>You've used all 20 free messages today. Resets tomorrow!</div>
            <button onClick={() => router.push("/pricing")} style={{ padding: "8px 20px", background: "#185FA5", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "700", cursor: "pointer", fontSize: "0.875rem" }}>
              Upgrade to Pro ⚡
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "16px", borderTop: "1px solid rgba(24,95,165,0.2)", background: "rgba(4,44,83,0.95)" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", maxWidth: "800px", margin: "0 auto" }}>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder={limitReached ? "Limit reached. Upgrade to continue..." : "Ask me anything about code..."}
            disabled={limitReached} rows={1}
            style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(24,95,165,0.3)", borderRadius: "12px", color: "#E6F1FB", fontSize: "0.9rem", outline: "none", resize: "none", fontFamily: "'Segoe UI', sans-serif", lineHeight: "1.5", opacity: limitReached ? 0.5 : 1 }} />
          <button onClick={sendMessage} disabled={loading || limitReached || !input.trim()}
            style={{ padding: "12px 20px", background: loading || limitReached || !input.trim() ? "rgba(24,95,165,0.4)" : "#185FA5", border: "none", borderRadius: "12px", color: "#fff", fontWeight: "700", fontSize: "0.9rem", cursor: loading || limitReached || !input.trim() ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
            {loading ? "..." : "Send →"}
          </button>
        </div>
        <p style={{ textAlign: "center", color: "rgba(230,241,251,0.2)", fontSize: "0.72rem", marginTop: "8px", marginBottom: 0 }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}