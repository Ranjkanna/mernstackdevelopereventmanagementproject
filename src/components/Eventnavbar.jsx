import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonGroup, ToggleButton, Nav, Carousel } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import WelcomeHost from "../components/WelcomeHost";
import { useAuth } from "../components/AuthContext";

import slide1 from "../assets/13695031_1920_1080_30fps.mp4";
import slide2 from "../assets/4317217-hd_1920_1080_25fps.mp4";
import slide3 from "../assets/13507851_3840_2160_24fps.mp4";
import slide4 from "../assets/5698562-uhd_3840_2160_25fps.mp4";
import whatsappImg from "../assets/imagewha.png";
import instaImg    from "../assets/instaimg.png";
import emailImg    from "../assets/emailimage.png";
import threadsImg  from "../assets/Threads.png";

// ── Logo ──────────────────────────────────────────────────────────────────────
function EventPlannerLogo({ width = 280, height = 110 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 680 300"
      xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Event Planner logo">
      <defs>
        <linearGradient id="pentaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7B2FBE" /><stop offset="50%" stopColor="#5B4FE8" /><stop offset="100%" stopColor="#2979FF" />
        </linearGradient>
        <linearGradient id="pentaBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AAFF" /><stop offset="100%" stopColor="#82B1FF" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7B2FBE" /><stop offset="50%" stopColor="#5B4FE8" /><stop offset="100%" stopColor="#2979FF" />
        </linearGradient>
        <linearGradient id="tagGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9B59B6" /><stop offset="100%" stopColor="#5B9FFF" />
        </linearGradient>
      </defs>
      <polygon points="140,53 192,90 173,152 107,152 88,90" fill="url(#pentaGrad)" />
      <polygon points="140,61 184,95 167,146 113,146 96,95" fill="none" stroke="url(#pentaBorder)" strokeWidth="1.5" opacity="0.7" />
      <text x="115" y="120" fontFamily="sans-serif" fontSize="28" fontWeight="700" fill="white">EP</text>
      <ellipse cx="68" cy="98" rx="16" ry="20" fill="#FF6B6B" /><path d="M68 118 Q65 128 68 138" stroke="#FF6B6B" strokeWidth="1.2" fill="none" /><ellipse cx="62" cy="91" rx="4" ry="5" fill="white" opacity="0.25" />
      <ellipse cx="90" cy="72" rx="14" ry="18" fill="#E8B86D" /><path d="M90 90 Q87 100 90 112" stroke="#E8B86D" strokeWidth="1.2" fill="none" /><ellipse cx="85" cy="66" rx="3" ry="4" fill="white" opacity="0.25" />
      <ellipse cx="55" cy="68" rx="13" ry="17" fill="#4ECDC4" /><path d="M55 85 Q52 95 56 106" stroke="#4ECDC4" strokeWidth="1.2" fill="none" /><ellipse cx="50" cy="63" rx="3" ry="4" fill="white" opacity="0.25" />
      <ellipse cx="214" cy="76" rx="14" ry="18" fill="#9B59B6" /><path d="M214 94 Q211 104 214 116" stroke="#9B59B6" strokeWidth="1.2" fill="none" /><ellipse cx="209" cy="70" rx="3" ry="4" fill="white" opacity="0.25" />
      <ellipse cx="197" cy="98" rx="13" ry="17" fill="#FF8FB1" /><path d="M197 115 Q194 125 197 137" stroke="#FF8FB1" strokeWidth="1.2" fill="none" /><ellipse cx="192" cy="92" rx="3" ry="4" fill="white" opacity="0.25" />
      <path d="M68 138 Q90 155 140 158" stroke="#aaa" strokeWidth="0.8" fill="none" />
      <path d="M90 112 Q110 148 140 158" stroke="#aaa" strokeWidth="0.8" fill="none" />
      <path d="M56 106 Q85 148 140 158" stroke="#aaa" strokeWidth="0.8" fill="none" />
      <path d="M214 116 Q190 148 140 158" stroke="#aaa" strokeWidth="0.8" fill="none" />
      <path d="M197 137 Q175 152 140 158" stroke="#aaa" strokeWidth="0.8" fill="none" />
      <path d="M128 158 Q136 150 140 158 Q144 150 152 158 Q144 166 140 158 Q136 166 128 158Z" fill="#E8B86D" />
      <circle cx="140" cy="158" r="3" fill="#C89A3D" />
      <rect x="42" y="138" width="7" height="7" rx="1" fill="#FF6B6B" transform="rotate(20,46,142)" />
      <circle cx="30" cy="110" r="4" fill="#4ECDC4" />
      <rect x="218" y="130" width="7" height="7" rx="1" fill="#9B59B6" transform="rotate(-30,222,134)" />
      <circle cx="230" cy="100" r="3" fill="#E8B86D" />
      <rect x="75" y="38" width="6" height="6" rx="1" fill="#FF8FB1" transform="rotate(15,78,41)" />
      <circle cx="195" cy="48" r="3" fill="#4ECDC4" />
      <rect x="155" y="35" width="5" height="5" rx="1" fill="#FF6B6B" transform="rotate(-10,158,38)" />
      <line x1="270" y1="168" x2="620" y2="168" stroke="url(#tagGrad)" strokeWidth="0.8" opacity="0.4" />
      <text x="272" y="145" fontFamily="sans-serif" fontSize="52" fontWeight="700" fill="url(#textGrad)">Event Planner</text>
      <text x="274" y="198" fontFamily="Georgia, serif" fontSize="18" fontStyle="italic" fill="url(#tagGrad)">crafting moments worth remembering</text>
    </svg>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon:"💍", label:"Wedding",      desc:"Destination & traditional weddings",  color:"#FF6B8A" },
  { icon:"🎂", label:"Birthday",     desc:"Themes, cakes & surprise setups",     color:"#E8B86D" },
  { icon:"🏢", label:"Corporate",    desc:"Conferences, galas & team events",    color:"#4ECDC4" },
  { icon:"🎓", label:"Graduation",   desc:"Memorable farewell ceremonies",       color:"#9B59B6" },
  { icon:"💃", label:"Reception",    desc:"Grand receptions & sangeet nights",   color:"#FF8FB1" },
  { icon:"🌟", label:"Custom Event", desc:"We plan anything you imagine",        color:"#5B4FE8" },
];

// ── Tara's canned responses ──────────────────────────────────────────────────

const CHAT_RULES = [
  { keywords: ["hi","hello","hey"],
    reply: "👋 Hey there! I'm Tara. Ask me about weddings, birthdays, corporate events, pricing, or how to book — happy to help!" },
  { keywords: ["price","pricing","cost","budget","how much"],
    reply: "💰 Pricing depends on guest count, venue, and add-ons — most events range from ₹50,000 for smaller gatherings up to several lakhs for large weddings. Hit 'Get Started Free' above and we'll work out an exact quote with you." },
  { keywords: ["wedding","marriage","shaadi"],
    reply: "💍 We plan both destination and traditional weddings — venue, decor, catering, the works. Tap 'Book Now' under Wedding above to get started!" },
  { keywords: ["birthday","bday"],
    reply: "🎂 Birthdays are one of our favorites — themes, cakes, surprise setups, all customizable. Tap 'Book Now' under Birthday above!" },
  { keywords: ["corporate","conference","office event","team event"],
    reply: "🏢 We handle conferences, galas, and team events end-to-end. Tap 'Book Now' under Corporate above to tell us more." },
  { keywords: ["graduation","farewell","convocation"],
    reply: "🎓 We put together memorable graduation and farewell ceremonies. Tap 'Book Now' under Graduation above!" },
  { keywords: ["reception","sangeet"],
    reply: "💃 Grand receptions and sangeet nights are a specialty. Tap 'Book Now' under Reception above to get things moving." },
  { keywords: ["custom","something else","other event"],
    reply: "🌟 If it's an event, we can probably plan it — even if it doesn't fit a standard category. Tap 'Book Now' under Custom Event above and tell us your vision." },
  { keywords: ["book","booking","how do i","sign up","register","get started"],
    reply: "🎉 Easy — click 'Get Started Free' or any 'Book Now' button above, sign up, and you'll land on your dashboard where you can fill in your event details, guest count, and venue location on the map." },
  { keywords: ["venue","location","hall","mahal"],
    reply: "📍 You can pick any venue you like — once you're on the booking form, search or paste a Google Maps link and we'll pin the exact spot for you." },
  { keywords: ["contact","phone","call","whatsapp","email"],
    reply: "📞 You can reach the team directly at 98076 51234, on WhatsApp via the icon in the top nav, or at explore@EventPlanner.com." },
  { keywords: ["thank","thanks","thank you"],
    reply: "You're so welcome! 😊 Let me know if there's anything else about your event I can help with." },
];

const DEFAULT_REPLY = "I'm not totally sure about that one — but I can help with pricing, venues, or booking for weddings, birthdays, corporate events, graduations, receptions, or custom events. What would you like to know?";

function getTaraReply(userMsg) {
  const lower = userMsg.toLowerCase();
  const match = CHAT_RULES.find(rule => rule.keywords.some(kw => lower.includes(kw)));
  return match ? match.reply : DEFAULT_REPLY;
}

// ── AI Chatbot ────────────────────────────────────────────────────────────────
function AIChatbot() {
  const [open,  setOpen]  = useState(false);
  const [msgs,  setMsgs]  = useState([
    { from:"bot", text:"👋 Hi! I'm your Event Planning AI. Ask me anything about weddings, birthdays, corporate events, or pricing!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMsgs(m => [...m, { from:"user", text:userMsg }]);
    setInput("");
    setLoading(true);
       setTimeout(() => {
      const reply = getTaraReply(userMsg);
      setMsgs(m => [...m, { from:"bot", text:reply }]);
      setLoading(false);
    }, 500);
  };

  const handleKey = (e) => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); } };

  return (
    <>
      <button onClick={() => setOpen(o=>!o)} style={cb.fab} title="Chat with AI">
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div style={cb.window}>
          <div style={cb.header}>
            <span>🤖</span>
            <div>
              <p style={cb.hName}>Tara AI</p>
              <p style={cb.hSub}>Event Planning Assistant</p>
            </div>
            <button onClick={() => setOpen(false)} style={cb.close}>✕</button>
          </div>

          <div style={cb.msgs}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent: m.from==="user"?"flex-end":"flex-start", marginBottom:10 }}>
                <div style={m.from==="user" ? cb.userBub : cb.botBub}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:10 }}>
                <div style={cb.botBub}>✨ Thinking...</div>
              </div>
            )}
          </div>

          <div style={cb.inputRow}>
            <input
              style={cb.input}
              placeholder="Ask about events, pricing..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button onClick={send} style={cb.send} disabled={loading}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

const cb = {
  fab: {
    position:"fixed", bottom:28, left:28, zIndex:9998,
    width:56, height:56, borderRadius:"50%",
    background:"linear-gradient(135deg,#7B2FBE,#2979FF)",
    color:"#fff", fontSize:24, border:"none", cursor:"pointer",
    boxShadow:"0 4px 20px rgba(123,47,190,0.45)",
    transition:"transform 0.2s",
  },
  window: {
    position:"fixed", bottom:96, left:20, zIndex:9997,
    width:340, height:480, borderRadius:20,
    background:"#fff", boxShadow:"0 20px 60px rgba(0,0,0,0.2)",
    display:"flex", flexDirection:"column",
    border:"1.5px solid rgba(123,47,190,0.15)", overflow:"hidden",
  },
  header: {
    background:"linear-gradient(135deg,#7B2FBE,#2979FF)",
    padding:"14px 16px", display:"flex", alignItems:"center", gap:12,
  },
  hName:  { color:"#fff", fontWeight:700, fontSize:14, margin:0 },
  hSub:   { color:"rgba(255,255,255,0.7)", fontSize:11, margin:0 },
  close:  { marginLeft:"auto", background:"none", border:"none", color:"#fff", cursor:"pointer", fontSize:16 },
  msgs:   { flex:1, overflowY:"auto", padding:"16px 12px" },
  botBub: {
    background:"linear-gradient(135deg,#f0ebff,#e8e0ff)",
    color:"#1a0050", padding:"10px 14px", borderRadius:"4px 16px 16px 16px",
    fontSize:13, lineHeight:1.5, maxWidth:"85%",
  },
  userBub: {
    background:"linear-gradient(135deg,#7B2FBE,#2979FF)",
    color:"#fff", padding:"10px 14px", borderRadius:"16px 4px 16px 16px",
    fontSize:13, lineHeight:1.5, maxWidth:"85%",
  },
  inputRow: {
    display:"flex", padding:"10px 12px", gap:8,
    borderTop:"1px solid #f0ebff", background:"#fafaff",
  },
  input: {
    flex:1, padding:"10px 14px", borderRadius:20,
    border:"1.5px solid #e0d6ff", fontSize:13, outline:"none",
  },
  send: {
    background:"linear-gradient(135deg,#7B2FBE,#2979FF)",
    color:"#fff", border:"none", borderRadius:"50%",
    width:38, height:38, cursor:"pointer", fontSize:14,
    flexShrink:0,
  },
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Eventnavbar() {
  const navigate       = useNavigate();
  const { user, logout } = useAuth();
  const [checked, setChecked] = useState(false);

  const videoData = [
    { id:1, src:slide1, title:"Grand Ballroom Gala Evening" },
    { id:2, src:slide2, title:"The Art of Event Lighting & Decoration" },
    { id:3, src:slide3, title:"All Your Events in One Place" },
    { id:4, src:slide4, title:"Your Vision, Our Masterpiece." },
  ];

  // ── Navigation map ──────────────────────────────────────────────────────────
  // ALL routes below funnel to the SINGLE "/Dashboard" route.
  // Dashboard.jsx reads user.isAdmin and renders AdminDashboard or UserDashboard.
  // There is no separate "/admin" or "/AdminDashboard" route — keep everything
  // pointed at "/Dashboard" so it matches App.jsx exactly.

  // "Let's get together" hero button → Live Experience page first
  const goLiveExperience = () => navigate("/LiveExperience");

  // Book Now / Get Started → register if logged out, else the single Dashboard route
  const goBook = () => {
    if (user) navigate("/Eventregister");
    else       navigate("/UserDashboard");
  };

  // Navbar Dashboard button → login if logged out, else the single Dashboard route
  // (Dashboard.jsx itself decides Admin vs User view — no need to branch here)
  const goDashboard = () => {
    if (!user) navigate("/Eventlogin");
    else       navigate("/Dashboard");
  };

  return (
    <div className="page-wrapper">
      <style>{`
        *{ box-sizing:border-box; }

        .custom-navbar{
          display:flex; align-items:center; justify-content:space-between;
          padding:0 36px; background:#fff; height:115px;
          position:sticky; top:0; z-index:1000;
          box-shadow:0 2px 16px rgba(0,0,0,0.08);
        }
        .nav-side-container a{ display:flex; align-items:center; text-decoration:none; }
        .nav-right-container { display:flex; align-items:center; gap:8px; }
        .nav-link{
          color:#444 !important; font-weight:600; font-size:15px;
          padding:7px 16px !important; border-radius:8px;
          transition:background 0.2s,color 0.2s;
        }
        .nav-link:hover{ background:linear-gradient(135deg,#7B2FBE,#2979FF); color:#fff !important; }

        .dash-btn{
          background:linear-gradient(135deg,#7B2FBE,#2979FF); color:#fff;
          border:none; border-radius:25px; padding:9px 20px;
          font-size:14px; font-weight:700; cursor:pointer;
          display:flex; align-items:center; gap:6px; white-space:nowrap;
          box-shadow:0 3px 12px rgba(123,47,190,0.35);
          transition:opacity 0.2s,transform 0.2s;
        }
        .dash-btn:hover{ opacity:0.88; transform:translateY(-1px); }

        .logout-btn{
          background:rgba(255,107,107,0.1); color:#c0392b;
          border:1px solid #FF6B6B; border-radius:20px;
          padding:7px 16px; font-size:13px; font-weight:700;
          cursor:pointer; transition:background 0.2s;
        }
        .logout-btn:hover{ background:rgba(255,107,107,0.2); }

        .user-greeting{
          font-size:13px; color:#7B2FBE; font-weight:600;
          white-space:nowrap; max-width:140px;
          overflow:hidden; text-overflow:ellipsis;
        }

        .call-btn{
          background:linear-gradient(135deg,#7B2FBE,#2979FF); color:#fff;
          border:none; border-radius:25px; padding:9px 20px;
          font-size:14px; font-weight:700; cursor:pointer;
          display:flex; align-items:center; gap:6px; white-space:nowrap;
          box-shadow:0 3px 12px rgba(123,47,190,0.35);
          transition:opacity 0.2s,transform 0.2s;
        }
        .call-btn:hover{ opacity:0.88; transform:translateY(-1px); }
        .icon-link{ display:flex; align-items:center; transition:transform 0.2s; }
        .icon-link:hover{ transform:scale(1.12); }

        .hero-carousel{ height:600px; width:100%; overflow:hidden; background:#000; position:relative; }
        .hero-video   { width:100%; height:600px; object-fit:cover; display:block; }
        .hero-overlay {
          position:absolute; top:0; left:0; width:100%; height:100%;
          background:linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.62) 100%);
          display:flex; align-items:center; justify-content:center;
        }
        .hero-content{ text-align:center; padding:0 20px; }
        .hero-content h1{
          font-size:3rem; font-weight:800; color:#fff;
          text-shadow:0 3px 16px rgba(0,0,0,0.6);
          margin-bottom:28px; letter-spacing:1px;
        }
        .hero-btn{
          background:linear-gradient(135deg,#7B2FBE,#2979FF) !important;
          color:#fff !important; border:none !important;
          padding:14px 36px !important; font-size:17px !important;
          font-weight:700 !important; border-radius:32px !important;
          box-shadow:0 6px 24px rgba(123,47,190,0.45) !important;
          transition:transform 0.2s,box-shadow 0.2s !important;
        }
        .hero-btn:hover{ transform:translateY(-3px); box-shadow:0 10px 30px rgba(123,47,190,0.55) !important; }

        .services-section{
          padding:72px 40px;
          background:linear-gradient(160deg,#fafbff 0%,#f0f0ff 100%);
        }
        .section-eyebrow{
          text-align:center; font-size:13px; font-weight:700;
          letter-spacing:3px; text-transform:uppercase;
          background:linear-gradient(135deg,#7B2FBE,#2979FF);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; margin-bottom:10px;
        }
        .section-title{ text-align:center; font-size:2.2rem; font-weight:800; color:#1a1a2e; margin-bottom:8px; }
        .section-sub  { text-align:center; color:#777; font-size:15px; margin-bottom:48px; }
        .services-grid{
          display:grid; grid-template-columns:repeat(3,1fr);
          gap:24px; max-width:1000px; margin:0 auto 48px;
        }
        @media(max-width:768px){
          .services-grid{ grid-template-columns:repeat(2,1fr); }
          .hero-content h1{ font-size:2rem; }
          .custom-navbar{ padding:0 16px; height:80px; }
          .cta-banner{ flex-direction:column; text-align:center; }
        }
        @media(max-width:480px){ .services-grid{ grid-template-columns:1fr; } }

        .service-card{
          background:#fff; border-radius:20px; padding:32px 24px;
          text-align:center; box-shadow:0 4px 24px rgba(0,0,0,0.06);
          border:1.5px solid rgba(123,47,190,0.08);
          transition:transform 0.25s,box-shadow 0.25s;
          cursor:pointer; position:relative; overflow:hidden;
        }
        .service-card::before{
          content:''; position:absolute; top:0; left:0; right:0; height:4px;
          background:var(--card-color); border-radius:20px 20px 0 0;
        }
        .service-card:hover{ transform:translateY(-6px); box-shadow:0 12px 36px rgba(123,47,190,0.15); }
        .service-icon { font-size:2.8rem; margin-bottom:14px; display:block; }
        .service-label{ font-size:17px; font-weight:700; color:#1a1a2e; margin-bottom:6px; }
        .service-desc { font-size:13px; color:#888; line-height:1.5; margin-bottom:18px; }
        .book-btn{
          display:inline-block; padding:9px 24px; border-radius:20px;
          font-size:13px; font-weight:700; color:#fff;
          background:var(--card-color); border:none; cursor:pointer;
          transition:opacity 0.2s,transform 0.2s; text-decoration:none;
        }
        .book-btn:hover{ opacity:0.85; transform:scale(1.04); color:#fff; }

        .cta-banner{
          background:linear-gradient(135deg,#7B2FBE 0%,#5B4FE8 50%,#2979FF 100%);
          border-radius:24px; padding:48px 40px;
          max-width:1000px; margin:0 auto;
          display:flex; align-items:center; justify-content:space-between;
          gap:24px; flex-wrap:wrap;
          box-shadow:0 12px 40px rgba(123,47,190,0.3);
        }
        .cta-text h2{ font-size:1.9rem; font-weight:800; color:#fff; margin:0 0 8px; }
        .cta-text p { color:rgba(255,255,255,0.8); margin:0; font-size:15px; }
        .cta-actions{ display:flex; gap:12px; flex-wrap:wrap; }
        .cta-primary{
          background:#fff; color:#7B2FBE; border:none; border-radius:25px;
          padding:13px 28px; font-size:15px; font-weight:800; cursor:pointer;
          transition:transform 0.2s,box-shadow 0.2s; white-space:nowrap;
        }
        .cta-primary:hover{ transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.2); }
        .cta-secondary{
          background:rgba(255,255,255,0.15); color:#fff;
          border:2px solid rgba(255,255,255,0.5); border-radius:25px;
          padding:11px 26px; font-size:15px; font-weight:700; cursor:pointer;
          transition:background 0.2s; white-space:nowrap;
        }
        .cta-secondary:hover{ background:rgba(255,255,255,0.25); }

        .footer{
          background:linear-gradient(135deg,#1a0a2e 0%,#0d1b4b 100%);
          padding:52px 20px 32px; text-align:center;
        }
        .footer-taglines{ display:flex; justify-content:center; gap:32px; flex-wrap:wrap; margin-bottom:28px; }
        .footer-tagline { color:rgba(255,255,255,0.8); font-size:14px; font-weight:500; }
        .footer-divider { width:80px; height:2px; background:linear-gradient(90deg,#7B2FBE,#2979FF); margin:0 auto 24px; border-radius:2px; }
        .footer-socials { display:flex; justify-content:center; align-items:center; gap:16px; margin-bottom:28px; }
        .social-icon{
          width:46px; height:46px; border-radius:50%;
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.15);
          display:flex; align-items:center; justify-content:center;
          transition:background 0.2s,transform 0.2s; overflow:hidden;
        }
        .social-icon:hover{ background:rgba(123,47,190,0.45); transform:translateY(-3px); }
        .footer-contact{ color:#C4A95B; font-size:15px; font-weight:600; margin-bottom:8px; }
        .footer-copy   { color:rgba(255,255,255,0.35); font-size:13px; }
        @keyframes blink{ 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="custom-navbar">
        <div className="nav-side-container">
          <Link to="/"><EventPlannerLogo width={360} height={140} /></Link>
        </div>

        <div className="nav-right-container">
          <Nav style={{ display:'flex', flexDirection:'row', alignItems:'center' }}>
            <Nav.Link as={Link} to="/Gallery" className="nav-link">Gallery</Nav.Link>

            
            
                <Nav.Link as={Link} to="/Eventregister" className="nav-link">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/Eventlogin" className="nav-link">Log In</Nav.Link>
            
</Nav>
          

          <a href="https://wa.me/919807651234" target="_blank" rel="noreferrer" className="icon-link">
            <img src={whatsappImg} alt="WhatsApp" style={{ width:32, height:32, objectFit:'contain' }} />
          </a>
          <button className="call-btn" onClick={() => alert("📞 Call us at 98076 51234")}>
  📞 98076 51234
</button>

        </div>
      </nav>

      {/* ── HERO CAROUSEL ── */}
      <Carousel fade controls={false} indicators={true} className="hero-carousel">
        {videoData.map((item) => (
          <Carousel.Item key={item.id} interval={8000}>
            <video autoPlay loop muted playsInline className="hero-video">
              <source src={item.src} type="video/mp4" />
            </video>
            <div className="hero-overlay">
              <div className="hero-content">
                <h1>{item.title}</h1>
                <ButtonGroup>
                  <ToggleButton
                    id={`toggle-${item.id}`}
                    type="checkbox"
                    className="hero-btn"
                    checked={checked}
                    value="1"
                    onChange={(e) => {
                      setChecked(e.currentTarget.checked);
                      if (e.currentTarget.checked) goLiveExperience();
                    }}
                  >
                    ✨ Let's get together
                  </ToggleButton>
                </ButtonGroup>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* ── SERVICES / BOOKING ── */}
      <section className="services-section">
        <p className="section-eyebrow">✦ What We Offer ✦</p>
        <h2 className="section-title">Book Your Dream Event</h2>
        <p className="section-sub">Choose your event type and let us handle every detail</p>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <div className="service-card" key={s.label} style={{ '--card-color': s.color }}>
              <span className="service-icon">{s.icon}</span>
              <div className="service-label">{s.label}</div>
              <div className="service-desc">{s.desc}</div>
              <button className="book-btn" onClick={goBook}>Book Now</button>
            </div>
          ))}
        </div>

        <div className="cta-banner">
          <div className="cta-text">
            <h2>Ready to create something magical? ✨</h2>
            <p>Talk to our team and get a free consultation today.</p>
          </div>
          <div className="cta-actions">
            <button className="cta-primary" onClick={goBook}>
              🎉 Get Started Free
            </button>
           <button className="cta-secondary" onClick={() => alert("📞 Call us at 98076 51234")}>
  📞 Call Us Now
</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-taglines">
          <span className="footer-tagline">💍 Bring your Event to Life</span>
          <span className="footer-tagline">📸 Turn Moments into Memories</span>
          <span className="footer-tagline">📆 Plan Like a Pro</span>
        </div>
        <div className="footer-divider" />
        <div className="footer-socials">
          <a href="https://www.instagram.com/eventplanner234/#" target="_blank" rel="noreferrer" className="social-icon">
            <img src={instaImg} alt="Instagram" style={{ width:26, height:26, objectFit:'contain' }} />
          </a>
          <a href="https://www.threads.net/@eventplanner234" target="_blank" rel="noreferrer" className="social-icon">
            <img src={threadsImg} alt="Threads" style={{ width:26, height:26, objectFit:'contain' }} />
          </a>
          <a href="mailto:eventplanner234@gmail.com" className="social-icon">
            <img src={emailImg} alt="Email" style={{ width:26, height:26, objectFit:'contain' }} />
          </a>
        </div>
        <p className="footer-contact">✉ explore@EventPlanner.com</p>
        <p className="footer-copy">© 2026 EventPlanner. All rights reserved.</p>
      </footer>

      {/* ──  AI TARA HOST ── */}
      <WelcomeHost />

      {/* ── AI CHATBOT ── */}
      <AIChatbot />
    </div>
  );
}