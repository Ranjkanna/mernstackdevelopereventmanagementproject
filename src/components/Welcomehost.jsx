import React, { useEffect, useRef, useState } from "react";

// ─── Speech lines ────────────────────────────────────────────────────────────
const LINES = [
  "🙏 welcome! I'm Tara, your personal Event Host.\nWelcome to Event Planner — where dreams become celebrations!",
  "✨ Whether it's a grand wedding, a sparkling birthday bash, or an elegant corporate gala — we craft every detail with love.",
  "🌸 From floral mandaps to fairy-light receptions, your vision is our canvas. Let's paint something unforgettable together!",
  "💌 Tell me about your dream event and I'll guide you every step of the way. The magic starts right here!",
];

// ─── Petal colours ────────────────────────────────────────────────────────────
const PETAL_COLORS = ["#FF6B8A", "#E8B86D", "#FF9FB1", "#C084FC", "#93C5FD", "#FDE68A"];

// ─── Petal canvas hook ────────────────────────────────────────────────────────
function usePetals(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const petals = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 7 + 4,
      c: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      s: Math.random() * 1.2 + 0.5,
      sw: Math.random() * 1.5 + 0.5,
      a: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.08,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.y += p.s;
        p.x += Math.sin(p.y / 40) * p.sw;
        p.a += p.spin;
        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.55;
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) {
        clearInterval(t);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);

  return { displayed, done };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WelcomeHost() {
  const [lineIdx, setLineIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef(null);
  usePetals(canvasRef);

  const { displayed, done } = useTypewriter(LINES[lineIdx]);

  const next = () => {
    if (lineIdx < LINES.length - 1) setLineIdx((i) => i + 1);
  };

  if (!visible) return null;

  return (
    <div style={styles.wrapper}>
      {/* Falling petals */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Rangoli decoration */}
      <svg style={styles.rangoli} width="120" height="200" viewBox="0 0 120 200">
        <circle cx="60" cy="160" r="50" fill="none" stroke="#E8B86D" strokeWidth="1" strokeDasharray="6 4" />
        <circle cx="60" cy="160" r="36" fill="none" stroke="#7B2FBE" strokeWidth="1" strokeDasharray="4 5" />
        <circle cx="60" cy="160" r="22" fill="none" stroke="#E8B86D" strokeWidth="1" />
        <polygon points="60,110 72,145 108,145 80,166 90,200 60,180 30,200 40,166 12,145 48,145"
          fill="#E8B86D" opacity="0.3" />
      </svg>

      {/* Speech bubble */}
      <div style={styles.bubble}>
        {/* Close button */}
        <button onClick={() => setVisible(false)} style={styles.closeBtn} aria-label="Close">✕</button>

        <p style={styles.speechText}>
          {displayed.split("\n").map((line, i) => (
            <span key={i}>{line}{i < displayed.split("\n").length - 1 && <br />}</span>
          ))}
          {!done && <span style={styles.cursor}>|</span>}
        </p>

        {done && (
          <div style={styles.btnRow}>
            {lineIdx < LINES.length - 1 && (
              <button onClick={next} style={styles.tagBtn}>Next ›</button>
            )}
            <button style={styles.tagBtn} onClick={() => window.location.href = "/Eventregister"}>
              🎉 Plan my event
            </button>
            <button style={styles.tagBtn} onClick={() => window.location.href = "/Gallery"}>
              💍 View Gallery
            </button>
          </div>
        )}
      </div>

      {/* Name plate */}
      <div style={styles.namePlate}>✦ Tara &nbsp;·&nbsp; Your Event Host ✦</div>

      {/* Glow ring */}
      <div style={styles.glowRing} />

      {/* Character SVG */}
      <div style={styles.characterWrap}>
        <TaraSVG />
      </div>
    </div>
  );
}

// ─── Tara SVG character ──────────────────────────────────────────────────────
function TaraSVG() {
  return (
    <svg width="150" height="320" viewBox="0 0 150 320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wh_g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7B2FBE" />
          <stop offset="40%" stopColor="#5B4FE8" />
          <stop offset="100%" stopColor="#2979FF" />

        </linearGradient>
        <linearGradient id="wh_g2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDDCB5" />
          <stop offset="100%" stopColor="#E8A87C" />
        </linearGradient>
        <linearGradient id="wh_g3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9B2FBE" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
        <radialGradient id="wh_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7B2FBE" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7B2FBE" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura */}
      <ellipse cx="75" cy="260" rx="60" ry="30" fill="url(#wh_glow)" opacity="0.5" />

      {/* Sari skirt */}
      <ellipse cx="75" cy="230" rx="50" ry="80" fill="url(#wh_g1)" />
      <ellipse cx="75" cy="230" rx="50" ry="80" fill="none" stroke="#E8B86D" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
      <path d="M48 200 Q75 220 102 200 Q95 250 75 270 Q55 250 48 200Z" fill="#5B4FE8" opacity="0.4" />
      <path d="M30 290 Q75 310 120 290" fill="none" stroke="#E8B86D" strokeWidth="3" />
      <path d="M30 290 Q75 310 120 290" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.5" />

      {/* Pallu */}
      <path d="M38 175 Q15 210 20 260 Q24 280 32 300" stroke="url(#wh_g1)" strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M38 175 Q15 210 20 260 Q24 280 32 300" stroke="#E8B86D" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M36 180 Q13 215 18 263" stroke="#FFD700" strokeWidth="1" fill="none" strokeDasharray="3 4" opacity="0.5" />

      {/* Blouse */}
      <path d="M48 168 Q75 160 102 168 L106 198 Q75 208 44 198 Z" fill="url(#wh_g3)" />
      <path d="M48 168 Q75 160 102 168" fill="none" stroke="#E8B86D" strokeWidth="1.5" />
      <path d="M44 198 Q75 208 106 198" fill="none" stroke="#E8B86D" strokeWidth="1.5" />

      {/* Neck */}
      <rect x="66" y="143" width="18" height="24" rx="8" fill="url(#wh_g2)" />

      {/* Head */}
      <ellipse cx="75" cy="118" rx="28" ry="30" fill="url(#wh_g2)" />

      {/* Hair */}
      <ellipse cx="75" cy="90" rx="26" ry="16" fill="#1a0a04" />
      <ellipse cx="75" cy="85" rx="18" ry="12" fill="#2C1A0E" />
      <ellipse cx="75" cy="80" rx="13" ry="10" fill="#1a0a04" />
      <circle cx="75" cy="74" r="8" fill="#2C1A0E" />
      {/* Flowers in hair */}
      <circle cx="88" cy="78" r="6" fill="#FF6B8A" opacity="0.9" />
      <circle cx="88" cy="78" r="3" fill="#FFD700" />
      <circle cx="80" cy="72" r="5" fill="#FF9FB1" opacity="0.8" />
      <circle cx="80" cy="72" r="2.5" fill="#FFD700" />
      <path d="M62 80 Q70 76 80 72 Q88 70 94 74" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />

      {/* Maang tikka */}
      <line x1="75" y1="88" x2="75" y2="100" stroke="#E8B86D" strokeWidth="1.2" />
      <circle cx="75" cy="100" r="4" fill="#E8B86D" />
      <circle cx="75" cy="100" r="2.5" fill="#FF3366" />
      {/* Bindi */}
      <circle cx="75" cy="108" r="3" fill="#CC0033" />
      <circle cx="75" cy="108" r="1.5" fill="#FF3366" />

      {/* Eyebrows */}
      <path d="M61 113 Q66 110 71 113" fill="none" stroke="#1a0a04" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M79 113 Q84 110 89 113" fill="none" stroke="#1a0a04" strokeWidth="1.5" strokeLinecap="round" />

      {/* Eyes */}
      <ellipse cx="66" cy="119" rx="5" ry="4" fill="white" />
      <ellipse cx="84" cy="119" rx="5" ry="4" fill="white" />
      <circle cx="67" cy="119" r="3" fill="#1a0a04" />
      <circle cx="85" cy="119" r="3" fill="#1a0a04" />
      <circle cx="68" cy="118" r="1" fill="white" />
      <circle cx="86" cy="118" r="1" fill="white" />
      <path d="M61 119 Q66 116 71 119" fill="none" stroke="#1a0a04" strokeWidth="1" />
      <line x1="61" y1="119" x2="58" y2="117" stroke="#1a0a04" strokeWidth="0.8" />
      <path d="M79 119 Q84 116 89 119" fill="none" stroke="#1a0a04" strokeWidth="1" />
      <line x1="89" y1="119" x2="92" y2="117" stroke="#1a0a04" strokeWidth="0.8" />

      {/* Nose */}
      <ellipse cx="75" cy="126" rx="3" ry="2.5" fill="#D4906A" opacity="0.4" />
      <circle cx="78.5" cy="126" r="3" fill="none" stroke="#E8B86D" strokeWidth="1" />
      <circle cx="80" cy="127" r="1" fill="#E8B86D" />

      {/* Lips */}
      <path d="M67 133 Q75 138 83 133" fill="#C0624A" />
      <path d="M67 133 Q75 136 83 133" fill="#E07055" opacity="0.6" />
      <path d="M69 133 Q75 131 81 133" fill="#CC5540" />

      {/* Blush */}
      <ellipse cx="58" cy="126" rx="6" ry="4" fill="#FF9999" opacity="0.2" />
      <ellipse cx="92" cy="126" rx="6" ry="4" fill="#FF9999" opacity="0.2" />

      {/* Earrings */}
      {[47, 103].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="120" r="5" fill="#E8B86D" />
          <circle cx={cx} cy="120" r="3" fill="#CC0033" />
          <path d={`M${cx - 4} 124 Q${cx} 136 ${cx + 4} 124`} fill="#E8B86D" />
          <circle cx={cx} cy="135" r="3" fill="#E8B86D" />
          <line x1={cx} y1="138" x2={cx} y2="144" stroke="#E8B86D" strokeWidth="1" />
          <circle cx={cx} cy="145" r="2.5" fill="#FFD700" />
        </g>
      ))}

      {/* Necklace */}
      <path d="M56 158 Q75 170 94 158" fill="none" stroke="#E8B86D" strokeWidth="2" />
      <path d="M59 162 Q75 175 91 162" fill="none" stroke="#E8B86D" strokeWidth="1.2" opacity="0.6" />
      <circle cx="75" cy="172" r="4" fill="#E8B86D" />
      <circle cx="75" cy="172" r="2" fill="#FF3366" />
      <circle cx="64" cy="167" r="2.5" fill="#E8B86D" />
      <circle cx="86" cy="167" r="2.5" fill="#E8B86D" />

      {/* Right arm raised */}
      <path d="M100 178 Q125 148 128 120" stroke="url(#wh_g2)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <ellipse cx="128" cy="113" rx="11" ry="10" fill="url(#wh_g2)" />
      <path d="M120 106 Q118 98 122 96" stroke="url(#wh_g2)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M126 104 Q125 95 129 94" stroke="url(#wh_g2)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M132 105 Q133 96 136 96" stroke="url(#wh_g2)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M136 108 Q140 102 142 103" stroke="url(#wh_g2)" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Bangles */}
      <ellipse cx="118" cy="136" rx="9" ry="4" fill="none" stroke="#E8B86D" strokeWidth="2.5" />
      <ellipse cx="120" cy="130" rx="9" ry="4" fill="none" stroke="#FF3366" strokeWidth="2" />
      <ellipse cx="122" cy="124" rx="8" ry="3.5" fill="none" stroke="#FFD700" strokeWidth="1.5" />

      {/* Left arm with bouquet */}
      <path d="M50 178 Q30 205 28 225" stroke="url(#wh_g2)" strokeWidth="13" fill="none" strokeLinecap="round" />
      <ellipse cx="27" cy="230" rx="10" ry="9" fill="url(#wh_g2)" />
      {/* Flowers */}
      <circle cx="18" cy="220" r="7" fill="#FF6B8A" opacity="0.9" />
      <circle cx="27" cy="215" r="7" fill="#FF9FB1" opacity="0.9" />
      <circle cx="36" cy="220" r="6" fill="#FF3366" opacity="0.85" />
      {[18, 27, 36].map((cx, i) => (
        <circle key={i} cx={cx} cy={i === 1 ? 215 : 220} r={i === 2 ? 2.5 : 3} fill="#FFD700" />
      ))}
      <line x1="18" y1="227" x2="23" y2="238" stroke="#2d6a2d" strokeWidth="1.5" />
      <line x1="27" y1="222" x2="27" y2="238" stroke="#2d6a2d" strokeWidth="1.5" />
      <line x1="36" y1="226" x2="31" y2="238" stroke="#2d6a2d" strokeWidth="1.5" />
      <ellipse cx="34" cy="212" rx="9" ry="4" fill="none" stroke="#E8B86D" strokeWidth="2" />
      <ellipse cx="33" cy="207" rx="8" ry="3.5" fill="none" stroke="#FFD700" strokeWidth="1.5" />

      {/* Feet & anklets */}
      <ellipse cx="58" cy="308" rx="14" ry="7" fill="url(#wh_g2)" />
      <ellipse cx="90" cy="308" rx="14" ry="7" fill="url(#wh_g2)" />
      <path d="M45 308 Q58 303 71 308" fill="none" stroke="#E8B86D" strokeWidth="1.5" />
      <path d="M77 308 Q90 303 103 308" fill="none" stroke="#E8B86D" strokeWidth="1.5" />
      <circle cx="54" cy="311" r="2" fill="none" stroke="#E8B86D" strokeWidth="1" />
      <circle cx="86" cy="311" r="2" fill="none" stroke="#E8B86D" strokeWidth="1" />
    </svg>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "340px",
    height: "420px",
    zIndex: 9999,
    pointerEvents: "none",
  },
  canvas: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%", height: "100%",
    pointerEvents: "none",
  },
  rangoli: {
    position: "absolute",
    left: 0, bottom: 0,
    opacity: 0.18,
    pointerEvents: "none",
  },
  bubble: {
    position: "absolute",
    bottom: "210px",
    right: "155px",
    maxWidth: "240px",
    background: "linear-gradient(135deg,#4a0080,#1a0050)",
    border: "1.5px solid #E8B86D",
    color: "white",
    padding: "16px 18px",
    borderRadius: "20px 20px 4px 20px",
    fontSize: "13px",
    lineHeight: "1.7",
    boxShadow: "0 0 30px rgba(123,47,190,0.5)",
    pointerEvents: "auto",
    zIndex: 20,
  },
  closeBtn: {
    position: "absolute",
    top: "6px", right: "10px",
    background: "none",
    border: "none",
    color: "#E8B86D",
    cursor: "pointer",
    fontSize: "13px",
    lineHeight: 1,
    padding: 0,
  },
  speechText: {
    margin: "0 0 10px",
    paddingRight: "12px",
  },
  cursor: {
    display: "inline-block",
    animation: "blink 0.7s step-end infinite",
    color: "#E8B86D",
  },
  btnRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "8px",
  },
  tagBtn: {
    background: "rgba(232,184,109,0.15)",
    border: "1px solid #E8B86D",
    color: "#E8B86D",
    padding: "5px 12px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "12px",
    pointerEvents: "auto",
    transition: "all 0.2s",
  },
  namePlate: {
    position: "absolute",
    bottom: "12px",
    right: "155px",
    background: "linear-gradient(90deg,#7B2FBE,#2979FF)",
    color: "white",
    fontSize: "11px",
    padding: "4px 14px",
    borderRadius: "20px",
    border: "1px solid #E8B86D",
    letterSpacing: "1px",
    pointerEvents: "none",
    zIndex: 25,
    whiteSpace: "nowrap",
  },
  glowRing: {
    position: "absolute",
    bottom: 0, right: 0,
    width: "160px", height: "160px",
    borderRadius: "50%",
    background: "radial-gradient(circle,rgba(123,47,190,0.3),transparent 70%)",
    pointerEvents: "none",
    zIndex: 1,
  },
  characterWrap: {
    position: "absolute",
    bottom: 0, right: 0,
    zIndex: 10,
    pointerEvents: "none",
  },
};