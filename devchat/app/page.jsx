"use client";
import { useEffect, useRef, useState } from "react";
import {
  Terminal,
  Zap,
  Shield,
  Clock,
  ChevronRight,
  Code2,
  MessageSquare,
  Star,
  ArrowRight,
} from "lucide-react";

function TypeWriter({ words }) {
  const [display, setDisplay] = useState("");
  const [wIdx, setWIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wIdx];
    let timeout;
    if (!deleting && charIdx < word.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), 80);
    } else if (!deleting && charIdx === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), 40);
    } else {
      setDeleting(false);
      setWIdx((w) => (w + 1) % words.length);
    }
    setDisplay(word.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wIdx, words]);

  return (
    <span className="text-[#1D9E75]">
      {display}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function GridBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #185FA5 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-[#185FA5] opacity-10 blur-[120px]" />
      <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] rounded-full bg-[#1D9E75] opacity-8 blur-[100px]" />
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white font-mono">{value}</div>
      <div className="text-sm text-[#8AAEC8] mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent }) {
  return (
    <div className="group relative rounded-2xl border border-[#185FA5]/30 bg-[#042C53]/60 p-6 hover:border-[#185FA5]/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(24,95,165,0.15)] backdrop-blur-sm">
      <div
        className="mb-4 inline-flex items-center justify-center w-11 h-11 rounded-xl"
        style={{ backgroundColor: accent + "22" }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2 font-mono">{title}</h3>
      <p className="text-[#8AAEC8] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingCard({ name, price, features, cta, highlight }) {
  return (
    <div
      className={`relative rounded-2xl p-6 flex flex-col gap-4 border transition-all duration-300 ${
        highlight
          ? "bg-gradient-to-b from-[#185FA5]/30 to-[#042C53] border-[#185FA5] shadow-[0_0_60px_rgba(24,95,165,0.2)]"
          : "bg-[#042C53]/60 border-[#185FA5]/20"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D9E75] text-white text-xs font-bold px-3 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      <div>
        <div className="text-[#8AAEC8] text-sm font-mono uppercase tracking-widest">{name}</div>
        <div className="text-4xl font-bold text-white mt-1 font-mono">
          {price}
          {price !== "Free" && (
            <span className="text-base font-normal text-[#8AAEC8]">/mo</span>
          )}
        </div>
      </div>
      <ul className="flex flex-col gap-2 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-[#C5D8EA]">
            <ChevronRight size={14} className="text-[#1D9E75] shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <a
        href="/auth"
        className={`mt-2 text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
          highlight
            ? "bg-[#185FA5] hover:bg-[#1a6bbf] text-white"
            : "border border-[#185FA5]/40 text-[#8AAEC8] hover:border-[#185FA5] hover:text-white"
        }`}
      >
        {cta}
      </a>
    </div>
  );
}

function Testimonial({ quote, name, role }) {
  return (
    <div className="rounded-2xl border border-[#185FA5]/20 bg-[#042C53]/50 p-6 backdrop-blur-sm">
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13} className="text-[#1D9E75] fill-[#1D9E75]" />
        ))}
      </div>
      <p className="text-[#C5D8EA] text-sm leading-relaxed mb-4">"{quote}"</p>
      <div>
        <div className="text-white text-sm font-semibold font-mono">{name}</div>
        <div className="text-[#8AAEC8] text-xs">{role}</div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current)
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: Terminal,
      title: "Dev-First AI Chat",
      desc: "Ask anything — debug errors, explain code, generate functions. Built for developers who think in code.",
      accent: "#185FA5",
    },
    {
      icon: Zap,
      title: "Instant Answers",
      desc: "Powered by Gemini. Get precise, fast responses without wading through docs or Stack Overflow.",
      accent: "#1D9E75",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      desc: "Your conversations stay yours. No training on your data. No selling your prompts.",
      accent: "#185FA5",
    },
    {
      icon: Clock,
      title: "Chat History",
      desc: "Every conversation saved. Jump back to any session, search past solutions, never lose context.",
      accent: "#1D9E75",
    },
    {
      icon: Code2,
      title: "Code-Aware",
      desc: "Syntax highlighting, multi-language support, and context-aware completions baked in.",
      accent: "#185FA5",
    },
    {
      icon: MessageSquare,
      title: "Freemium Model",
      desc: "Start free — 20 messages/day at no cost. Upgrade when you're ready to go unlimited.",
      accent: "#1D9E75",
    },
  ];

  const testimonials = [
    {
      quote: "Replaced my Stack Overflow habit entirely. DevChat answers in seconds with context I actually need.",
      name: "Raza M.",
      role: "Backend Engineer, Lahore",
    },
    {
      quote: "The free tier alone is better than half the tools I've paid for. Upgrading was a no-brainer.",
      name: "Sara K.",
      role: "Full-Stack Dev, Karachi",
    },
    {
      quote: "Finally — an AI chat that doesn't feel like it was designed for marketing teams. This is for coders.",
      name: "Ali H.",
      role: "DevOps Engineer, Islamabad",
    },
  ];

  return (
    <main className="min-h-screen font-mono" style={{ backgroundColor: "#03203D", color: "#E6F1FB" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md border-b border-[#185FA5]/20 bg-[#03203D]/80">
        <div className="flex items-center gap-2">
          <Terminal size={20} className="text-[#1D9E75]" />
          <span className="text-white font-bold text-lg tracking-tight">
            Dev<span className="text-[#185FA5]">Chat</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#8AAEC8]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="/auth" className="text-sm text-[#8AAEC8] hover:text-white transition-colors hidden md:block">
            Log in
          </a>
          <a href="/auth" className="bg-[#185FA5] hover:bg-[#1a6bbf] text-white text-sm px-4 py-2 rounded-lg transition-colors">
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        <GridBg />
        <div ref={heroRef} className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#042C53]/80 border border-[#185FA5]/40 rounded-full px-4 py-1.5 text-xs text-[#8AAEC8] mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
            Powered by Google Gemini · Free to start
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            The AI chat for
            <br />
            <TypeWriter words={["debugging code", "learning fast", "shipping faster", "real developers"]} />
          </h1>

          <p className="text-[#8AAEC8] text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Ask anything. Get clean, accurate answers. No fluff, no filler — just the dev knowledge you need, exactly when you need it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href="/auth"
              className="group flex items-center gap-2 bg-[#185FA5] hover:bg-[#1a6bbf] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_30px_rgba(24,95,165,0.5)]"
            >
              Start for Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#features"
              className="flex items-center gap-2 border border-[#185FA5]/40 hover:border-[#185FA5] text-[#8AAEC8] hover:text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
            >
              See features
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-[#185FA5]/20 grid grid-cols-3 gap-6 max-w-md mx-auto">
            <Stat value="20" label="Free msgs/day" />
            <Stat value="&lt;1s" label="Response time" />
            <Stat value="100%" label="Dev focused" />
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-1/3 -translate-y-1/2 bg-[#042C53]/90 border border-[#185FA5]/30 rounded-xl p-4 text-xs text-left backdrop-blur-sm max-w-[220px] rotate-2 shadow-xl">
          <div className="text-[#8AAEC8] mb-2">// ask anything</div>
          <div className="text-[#1D9E75]">{">"} Fix this TypeError</div>
          <div className="text-[#185FA5] mt-1">AI: Line 42 — you're</div>
          <div className="text-[#185FA5]">&nbsp;&nbsp;calling .map() on</div>
          <div className="text-[#185FA5]">&nbsp;&nbsp;undefined. Add a</div>
          <div className="text-[#185FA5]">&nbsp;&nbsp;null check first.</div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs text-[#1D9E75] uppercase tracking-widest mb-3">Why DevChat</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Built different. Built for devs.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative px-6 md:px-12 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#185FA5] opacity-5 blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs text-[#1D9E75] uppercase tracking-widest mb-3">Pricing</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Start free. Scale when ready.</h2>
            <p className="text-[#8AAEC8] mt-3">No credit card needed to start.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <PricingCard
              name="Free"
              price="Free"
              features={["20 messages per day", "Gemini AI responses", "Basic code support", "Web access"]}
              cta="Get Started Free"
              highlight={false}
            />
            <PricingCard
              name="Pro"
              price="$9"
              features={["Unlimited messages", "Priority AI responses", "Full chat history", "Advanced code features", "Early access to new tools"]}
              cta="Upgrade to Pro"
              highlight={true}
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="relative px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs text-[#1D9E75] uppercase tracking-widest mb-3">Reviews</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Loved by developers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => <Testimonial key={i} {...t} />)}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-br from-[#042C53] to-[#0a3a6e] border border-[#185FA5]/40 p-10 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #185FA5 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          <h2 className="text-3xl font-bold text-white mb-3 relative">Ready to code smarter?</h2>
          <p className="text-[#8AAEC8] mb-7 relative">
            Join developers already using DevChat to debug, learn, and ship faster.
          </p>
          <a
            href="/auth"
            className="inline-flex items-center gap-2 bg-[#185FA5] hover:bg-[#1a6bbf] text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_30px_rgba(24,95,165,0.5)]"
          >
            Sign Up Free <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#185FA5]/20 px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#8AAEC8]">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-[#1D9E75]" />
          <span className="text-white font-bold">Dev<span className="text-[#185FA5]">Chat</span></span>
          <span>· Built for developers</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="/auth" className="hover:text-white transition-colors">Sign Up</a>
        </div>
      </footer>
    </main>
  );
}