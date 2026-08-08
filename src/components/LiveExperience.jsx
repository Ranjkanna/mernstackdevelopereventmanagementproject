import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PHASES = [
  { icon: "📞", num: 1, label: "Discovery Call",     desc: "We learn your vision, budget & guest count in a free 30-min consultation" },
  { icon: "📋", num: 2, label: "Custom Proposal",    desc: "Tailored plan with venues, vendors, timeline & transparent pricing" },
  { icon: "✍️", num: 3, label: "Booking & Contract", desc: "Secure your date with confirmed vendor bookings & legal documentation" },
  { icon: "⚙️", num: 4, label: "Live Setup",         desc: "Our team handles every detail — décor, lighting, stage & coordination" },
  { icon: "🎉", num: 5, label: "The Big Day",        desc: "Smooth flow, elite hosting, live coordination — zero stress for you" },
];

const EXPERIENCES = [
  {
    icon: "💍",
    name: "Luxury Wedding",
    desc: "From the mandap design to floral walls, coordinated bridal entry, live music and a seamless 8-hour production that guests will talk about for years.",
    tags: ["Floral décor", "Mandap design", "Live band", "Photo + video", "Catering", "Bridal coordination"],
    color: "#FF6B8A",
    price: "Starting ₹2,50,000",
    featured: true,
  },
  {
    icon: "🏢",
    name: "Corporate Gala",
    desc: "Premium stage design, professional AV setup, branded guest experiences and seamless event management for 50 to 500 attendees.",
    tags: ["Stage & AV", "Branded setup", "Catering", "Guest management", "Photography"],
    color: "#4ECDC4",
    price: "Starting ₹75,000",
    featured: false,
  },
  {
    icon: "🎂",
    name: "Birthday Celebration",
    desc: "Themed setups, dramatic surprise reveals, balloon artistry, DJ entertainment and a curated celebration experience for any age.",
    tags: ["Theme décor", "Surprise entry", "DJ", "Balloon art", "Cake setup"],
    color: "#E8B86D",
    price: "Starting ₹30,000",
    featured: false,
  },
  {
    icon: "🎓",
    name: "Graduation Ceremony",
    desc: "Elegant farewell setups, stage production, photo booths and memorable moments to mark life's biggest academic achievement.",
    tags: ["Stage setup", "Photo booth", "Floral décor", "Catering"],
    color: "#9B59B6",
    price: "Starting ₹40,000",
    featured: false,
  },
  {
    icon: "💃",
    name: "Reception & Sangeet",
    desc: "Grand reception halls, choreographed sangeet nights, live performances and spectacular lighting to light up the night.",
    tags: ["Grand lighting", "Live performance", "Dance floor", "Dinner setup"],
    color: "#FF8FB1",
    price: "Starting ₹1,00,000",
    featured: false,
  },
  {
    icon: "🌟",
    name: "Custom Event",
    desc: "Have something unique in mind? We plan anything you imagine — product launches, anniversaries, private parties & more.",
    tags: ["Fully custom", "Any scale", "Any theme"],
    color: "#5B4FE8",
    price: "Custom quote",
    featured: false,
  },
];

const STATS = [
  { num: "500+", label: "Events delivered",    icon: "🏆" },
  { num: "98%",  label: "Client satisfaction", icon: "⭐" },
  { num: "12+",  label: "Years of expertise",  icon: "📅" },
  { num: "200+", label: "Trusted vendors",     icon: "🤝" },
];

const TESTIMONIALS = [
  {
    name: "Ananya Krishnan",
    event: "Wedding, Chennai",
    text: "Priya and her team turned our dream wedding into reality. The floral mandap was breathtaking and every detail was handled perfectly.",
    avatar: "AK",
  },
  {
    name: "Ramesh Nair",
    event: "Corporate Gala, Bengaluru",
    text: "Our annual gala was executed flawlessly — from the AV setup to the branded installations. 300 guests and not a single hiccup.",
    avatar: "RN",
  },
  {
    name: "Meera Pillai",
    event: "Birthday Party, Coimbatore",
    text: "My daughter's surprise birthday was magical. The theme décor was beyond what we imagined and the DJ kept everyone dancing!",
    avatar: "MP",
  },
];

export default function LiveExperience() {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const [activeExp, setActiveExp] = useState(0);

  const goBook = () => {
    if (!user) navigate("/Eventregister");
    else       navigate("/BookingForm");
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* ── HERO ── */}
      <div style={s.hero}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <div style={s.heroContent}>
          <p style={s.heroEyebrow}>✦ THE LIVE EXPERIENCE ✦</p>
          <h1 style={s.heroTitle}>Where your vision<br />becomes reality</h1>
          <p style={s.heroSub}>
            A client hires us for an event — a high-end corporate gala or a luxury wedding.<br />
            Guests arrive and physically experience the premium coordination, the smooth flow,<br />
            the lighting, and the elite design. <strong style={{ color: "#E8B86D" }}>That's what you're booking.</strong>
          </p>
          <div style={s.heroBtns}>
            <button style={s.heroCta} onClick={goBook}>
              ✨ Let's get together — Book now
            </button>
            <button style={s.heroGhost} onClick={() => document.getElementById('experiences').scrollIntoView({ behavior:'smooth' })}>
              Explore experiences ↓
            </button>
          </div>
        </div>

        {/* Floating stat pills */}
        <div style={s.statPills}>
          {STATS.map(st => (
            <div key={st.label} style={s.pill}>
              <span style={s.pillNum}>{st.icon} {st.num}</span>
              <span style={s.pillLabel}>{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={s.section}>
        <p style={s.eyebrow}>✦ HOW IT WORKS ✦</p>
        <h2 style={s.secTitle}>From first call to final applause</h2>
        <p style={s.secSub}>Every event follows our proven 5-step process</p>

        <div style={s.timeline}>
          {PHASES.map((p, i) => (
            <div key={p.num} style={s.timelineItem}>
              {/* Line */}
              {i < PHASES.length - 1 && <div style={s.timelineLine} />}
              {/* Icon */}
              <div style={s.timelineIcon}>
                <span style={{ fontSize: 26 }}>{p.icon}</span>
                <div style={s.timelineNum}>{p.num}</div>
              </div>
              {/* Text */}
              <div style={s.timelineText}>
                <h3 style={s.timelineLabel}>{p.label}</h3>
                <p style={s.timelineDesc}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE SELECTOR ── */}
      <section id="experiences" style={{ ...s.section, background: "linear-gradient(160deg,#fafbff,#f0ebff)" }}>
        <p style={s.eyebrow}>✦ CHOOSE YOUR EXPERIENCE ✦</p>
        <h2 style={s.secTitle}>What would you like to celebrate?</h2>
        <p style={s.secSub}>Click any event type to explore what's included</p>

        {/* Tab selectors */}
        <div style={s.tabs}>
          {EXPERIENCES.map((e, i) => (
            <button key={e.name} style={{ ...s.tab, ...(activeExp===i ? s.tabActive : {}) }}
              onClick={() => setActiveExp(i)}>
              <span>{e.icon}</span> {e.name}
            </button>
          ))}
        </div>

        {/* Active experience detail */}
        <div style={s.expDetail}>
          <div style={{ ...s.expDetailLeft, borderLeft: `4px solid ${EXPERIENCES[activeExp].color}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
              <span style={{ fontSize: 52 }}>{EXPERIENCES[activeExp].icon}</span>
              <div>
                <h3 style={s.expDetailName}>{EXPERIENCES[activeExp].name}</h3>
                <span style={{ ...s.expPrice, color: EXPERIENCES[activeExp].color }}>
                  {EXPERIENCES[activeExp].price}
                </span>
              </div>
              {EXPERIENCES[activeExp].featured && (
                <span style={s.featuredBadge}>⭐ Most booked</span>
              )}
            </div>
            <p style={s.expDetailDesc}>{EXPERIENCES[activeExp].desc}</p>
            <div style={s.expTags}>
              {EXPERIENCES[activeExp].tags.map(t => (
                <span key={t} style={{ ...s.expTag, borderColor: EXPERIENCES[activeExp].color, color: EXPERIENCES[activeExp].color }}>
                  ✓ {t}
                </span>
              ))}
            </div>
            <button style={{ ...s.expBookBtn, background: EXPERIENCES[activeExp].color }} onClick={goBook}>
              Book {EXPERIENCES[activeExp].name} →
            </button>
          </div>

          {/* What guests experience */}
          <div style={s.expDetailRight}>
            <h4 style={s.guestTitle}>What your guests will experience</h4>
            {[
              "Premium arrival experience with branded welcome",
              "Elite décor and lighting that creates the perfect ambience",
              "Seamless event flow with our on-ground coordinator",
              "Professional photography & videography team",
              "Curated catering and hospitality service",
              "Memorable send-off moments crafted with care",
            ].map((item, i) => (
              <div key={i} style={s.guestItem}>
                <span style={{ ...s.guestDot, background: EXPERIENCES[activeExp].color }} />
                <span style={s.guestText}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={s.section}>
        <p style={s.eyebrow}>✦ CLIENT STORIES ✦</p>
        <h2 style={s.secTitle}>What our clients say</h2>
        <div style={s.testGrid}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={s.testCard}>
              <p style={s.testText}>"{t.text}"</p>
              <div style={s.testAuthor}>
                <div style={s.testAvatar}>{t.avatar}</div>
                <div>
                  <p style={s.testName}>{t.name}</p>
                  <p style={s.testEvent}>{t.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={s.ctaSection}>
        <h2 style={s.ctaTitle}>Ready to create something magical?</h2>
        <p style={s.ctaSub}>Join 500+ clients who trusted us with their most important moments</p>
        <div style={s.ctaBtns}>
          <button style={s.ctaPrimary} onClick={goBook}>
            🎉 Let's get together — Start planning
          </button>
          <button style={s.ctaSecondary} onClick={() => navigate("/Gallery")}>
            View our gallery →
          </button>
          <button className="cta-secondary" onClick={() => alert("📞 Call us at 98076 51234")}>
  📞 Call Us Now
</button>
        </div>
      </section>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page:     { fontFamily:"sans-serif", minHeight:"100vh", background:"#fff" },

  // Hero
  hero: {
    background: "linear-gradient(135deg,#1a0a2e 0%,#2d1460 50%,#0d1b4b 100%)",
    padding: "60px 60px 80px", position: "relative", overflow: "hidden",
    minHeight: 480,
  },
  backBtn: {
    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff", borderRadius: 20, padding: "8px 18px", fontSize: 14,
    cursor: "pointer", marginBottom: 40, display: "inline-block",
  },
  heroContent:  { maxWidth: 700, position: "relative", zIndex: 2 },
  heroEyebrow:  { fontSize: 12, fontWeight: 700, letterSpacing: 3, color: "#E8B86D", marginBottom: 16 },
  heroTitle: {
    fontSize: "3.5rem", fontWeight: 800, color: "#fff",
    lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.5px",
  },
  heroSub:   { fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: 36 },
  heroBtns:  { display: "flex", gap: 14, flexWrap: "wrap" },
  heroCta: {
    background: "linear-gradient(135deg,#E8B86D,#FFA500)", color: "#1a0a2e",
    border: "none", borderRadius: 32, padding: "16px 36px",
    fontSize: 16, fontWeight: 800, cursor: "pointer",
    boxShadow: "0 8px 28px rgba(232,184,109,0.4)",
    transition: "transform 0.2s",
  },
  heroGhost: {
    background: "rgba(255,255,255,0.1)", color: "#fff",
    border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 32,
    padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer",
  },
  statPills: {
    position: "absolute", bottom: 32, right: 60,
    display: "flex", gap: 12, flexWrap: "wrap",
  },
  pill: {
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 16, padding: "12px 20px", textAlign: "center",
  },
  pillNum:   { display: "block", fontSize: 20, fontWeight: 800, color: "#E8B86D" },
  pillLabel: { display: "block", fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 },

  // Sections
  section:  { padding: "72px 60px", background: "#fff" },
  eyebrow: {
    textAlign: "center", fontSize: 12, fontWeight: 700,
    letterSpacing: 3, color: "#7B2FBE", marginBottom: 10,
  },
  secTitle: { textAlign: "center", fontSize: "2rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 8 },
  secSub:   { textAlign: "center", color: "#888", fontSize: 15, marginBottom: 48 },

  // Timeline
  timeline: { maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0 },
  timelineItem: { display: "flex", gap: 20, position: "relative", paddingBottom: 32 },
  timelineLine: {
    position: "absolute", left: 28, top: 60,
    width: 2, height: "calc(100% - 60px)",
    background: "linear-gradient(to bottom,#7B2FBE20,#2979FF20)",
  },
  timelineIcon: {
    width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
    background: "linear-gradient(135deg,#faf8ff,#f0ebff)",
    border: "1.5px solid rgba(123,47,190,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  timelineNum: {
    position: "absolute", top: -4, right: -4,
    width: 20, height: 20, borderRadius: "50%",
    background: "linear-gradient(135deg,#7B2FBE,#2979FF)",
    fontSize: 10, fontWeight: 700, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  timelineText:  { paddingTop: 12 },
  timelineLabel: { fontSize: 17, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px" },
  timelineDesc:  { fontSize: 14, color: "#777", lineHeight: 1.6, margin: 0 },

  // Experience tabs
  tabs: {
    display: "flex", flexWrap: "wrap", gap: 10,
    justifyContent: "center", marginBottom: 36,
  },
  tab: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 20px", borderRadius: 25, fontSize: 14, fontWeight: 600,
    border: "1.5px solid rgba(123,47,190,0.15)", cursor: "pointer",
    background: "#fff", color: "#555", transition: "all 0.2s",
  },
  tabActive: {
    background: "linear-gradient(135deg,#7B2FBE,#2979FF)",
    color: "#fff", border: "none",
    boxShadow: "0 4px 16px rgba(123,47,190,0.3)",
  },
  expDetail: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 32, maxWidth: 1000, margin: "0 auto",
    background: "#fff", borderRadius: 24,
    padding: 36, boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
    border: "1.5px solid rgba(123,47,190,0.08)",
  },
  expDetailLeft:  { paddingLeft: 20 },
  expDetailName:  { fontSize: "1.5rem", fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" },
  expPrice:       { fontSize: 15, fontWeight: 700 },
  featuredBadge: {
    background: "rgba(123,47,190,0.1)", color: "#7B2FBE",
    fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
    alignSelf: "flex-start",
  },
  expDetailDesc: { fontSize: 15, color: "#666", lineHeight: 1.7, margin: "16px 0 20px" },
  expTags:       { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  expTag: {
    fontSize: 12, padding: "6px 14px", borderRadius: 20,
    border: "1.5px solid", background: "transparent", fontWeight: 600,
  },
  expBookBtn: {
    color: "#fff", border: "none", borderRadius: 25, padding: "13px 28px",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)", transition: "transform 0.2s",
  },
  expDetailRight: { paddingLeft: 16, borderLeft: "1px solid rgba(123,47,190,0.1)" },
  guestTitle:     { fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 20 },
  guestItem:      { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  guestDot:       { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 6 },
  guestText:      { fontSize: 14, color: "#555", lineHeight: 1.5 },

  // Testimonials
  testGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
    gap: 20, maxWidth: 1000, margin: "0 auto",
  },
  testCard: {
    background: "#fff", borderRadius: 20, padding: "28px 24px",
    border: "1.5px solid rgba(123,47,190,0.08)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
  },
  testText:   { fontSize: 14, color: "#555", lineHeight: 1.8, fontStyle: "italic", marginBottom: 20 },
  testAuthor: { display: "flex", alignItems: "center", gap: 12 },
  testAvatar: {
    width: 44, height: 44, borderRadius: "50%",
    background: "linear-gradient(135deg,#7B2FBE,#2979FF)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0,
  },
  testName:   { fontSize: 14, fontWeight: 700, color: "#1a1a2e", margin: 0 },
  testEvent:  { fontSize: 12, color: "#888", margin: "2px 0 0" },

  // Final CTA
  ctaSection: {
    background: "linear-gradient(135deg,#1a0a2e,#0d1b4b)",
    padding: "80px 60px", textAlign: "center",
  },
  ctaTitle:     { fontSize: "2.2rem", fontWeight: 800, color: "#fff", marginBottom: 12 },
  ctaSub:       { color: "rgba(255,255,255,0.7)", fontSize: 16, marginBottom: 40 },
  ctaBtns:      { display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" },
  ctaPrimary: {
    background: "linear-gradient(135deg,#E8B86D,#FFA500)", color: "#1a0a2e",
    border: "none", borderRadius: 32, padding: "16px 36px",
    fontSize: 16, fontWeight: 800, cursor: "pointer",
    boxShadow: "0 8px 28px rgba(232,184,109,0.4)",
  },
  ctaSecondary: {
    background: "rgba(255,255,255,0.08)", color: "#fff",
    border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 32,
    padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer",
  },
};

const css = `
  @media(max-width: 768px) {
    .exp-detail { grid-template-columns: 1fr !important; }
  }
  button:hover { opacity: 0.9; transform: translateY(-1px); }
`;