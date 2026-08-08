import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import BookingForm from "../components/BookingForm";
import AdminCalendarMap from "../components/AdminCalendarMap";

// ── Event type → image + color mapping ─────────────────────────────────────
const TYPE_IMAGES = {
  Wedding:      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  Birthday:     "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
  Corporate:    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
  Graduation:   "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
  Reception:    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
  "Custom Event": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
};
const TYPE_COLORS = {
  Wedding:"#FF6B8A", Birthday:"#E8B86D", Corporate:"#4ECDC4",
  Graduation:"#9B59B6", Reception:"#FF8FB1", "Custom Event":"#5B4FE8",
};
const TYPE_ICON = {
  Wedding:"💍", Birthday:"🎂", Corporate:"🏢",
  Graduation:"🎓", Reception:"💃", "Custom Event":"🌟",
};

// ── Auto status (upcoming / completed) based on date ────────────────────────
// ✅ FIXED — now checks explicit "cancelled" status FIRST, before
//    falling back to date-based upcoming/completed calculation.
function autoStatus(booking) {
  if (booking?.status === "cancelled") return "cancelled";
  if (!booking?.date) return "upcoming";
  return new Date(booking.date) < new Date() ? "completed" : "upcoming";
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab,      setTab]      = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [msg,      setMsg]      = useState("");


  const headers = { Authorization: `Bearer ${user?.token}` };

  // ── Fetch bookings — calls real backend /api/events ─────────────────────
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/events", { headers });
      // ✅ Sort: upcoming first (nearest date first), then completed, then cancelled
      const sorted = res.data.sort((a, b) => {
        const statusOrder = { upcoming: 0, completed: 1, cancelled: 2 };
        const statusA = autoStatus(a);
        const statusB = autoStatus(b);
        if (statusA !== statusB) return statusOrder[statusA] - statusOrder[statusB];
        // Within same status, sort by date ascending (nearest first)
        return new Date(a.date) - new Date(b.date);
      });
      setBookings(sorted);
    } catch { setMsg("Failed to load bookings"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await axios.put(`/api/events/${id}`, { status: "cancelled" }, { headers });
      setMsg("Booking cancelled. The admin has been notified.");
      fetchBookings();
    } catch { setMsg("Could not cancel."); }
  };

  

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.avatar}>{user?.fullName?.[0]?.toUpperCase() || "U"}</div>
          <p style={s.username}>{user?.fullName}</p>
          <p style={s.email}>{user?.email}</p>
        </div>
        <nav style={s.nav}>
          {[
            { id:"bookings", icon:"📋", label:"My Bookings" },
            { id:"new",      icon:"➕", label:"New Booking"  },
            { id:"calendar", icon:"🗺️", label:"My Calendar & Map" },
            
          ].map(n => (
            <button key={n.id} style={{ ...s.navBtn, ...(tab===n.id ? s.navActive:{}) }}
              onClick={() => { setTab(n.id); setMsg(""); }}>
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
        <button style={s.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
      </aside>

      {/* ── Main ── */}
      <main style={s.main}>
        {msg && <div style={s.msgBox}>{msg}</div>}

        {/* MY BOOKINGS — event cards */}
        {tab === "bookings" && (
          <div>
            <h2 style={s.pageTitle}>My Bookings</h2>
            {loading ? <p style={s.muted}>Loading...</p>
              : bookings.length === 0 ? (
                <div style={s.empty}>
                  <p style={{ fontSize:48 }}>📭</p>
                  <p>No bookings yet.</p>
                  <button style={s.cta} onClick={() => setTab("new")}>Create your first booking</button>
                </div>
              ) : (
                <div style={s.grid}>
                  {bookings.map(b => {
                    const type   = b.event || "Custom Event";
                    const image  = b.image || TYPE_IMAGES[type] || TYPE_IMAGES["Custom Event"];
                    const color  = TYPE_COLORS[type] || "#5B4FE8";
                    const icon   = TYPE_ICON[type] || "🌟";
                    const status = autoStatus(b);
                    const d      = b.date ? new Date(b.date) : null;

                    return (
                      <div key={b._id} style={s.card}>
                        {/* Image header */}
                        <div style={s.cardImageWrap}>
                          <img src={image} alt={type} style={s.cardImage}
                            onError={e => { e.target.src = TYPE_IMAGES["Custom Event"]; }} />
                          <div style={s.cardImageOverlay} />
                          {/* Status badge — top right */}
                          <span style={{
                            ...s.statusBadge,
                            background: status === "upcoming" ? "#E8B86D" :
                                        status === "completed" ? "#4ECDC4" : "#FF6B6B",
                          }}>
                            {status === "upcoming" ? "● UPCOMING" :
                             status === "completed" ? "✔ COMPLETED" : "✕ CANCELLED"}
                          </span>
                          {/* Type chip — bottom left on image */}
                          <span style={{ ...s.typeChip, background: color }}>
                            {icon} {type}
                          </span>
                        </div>

                        {/* Body */}
                        <div style={s.cardBody}>
                          {/* Booker name */}
                          <p style={s.bookerName}>👤 {user?.fullName || "You"}</p>
                          <h3 style={s.cardTitle}>{b.name || type}</h3>

                          <div style={s.cardRow}>
                            <span style={s.label}>📅 Date</span>
                            <span>{d ? d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "No date"}</span>
                          </div>

                          {(b.time || b.endTime) && (
                            <div style={s.cardRow}>
                              <span style={s.label}>🕐 Time</span>
                              <span>{b.time || "—"}{b.endTime ? ` – ${b.endTime}` : ""}</span>
                            </div>
                          )}

                          <div style={s.cardRow}>
                            <span style={s.label}>📍 Venue</span>
                            <span style={s.venueText}>{b.location || "No location"}</span>
                          </div>

                          <div style={s.cardRow}>
                            <span style={s.label}>👥 Guests</span>
                            <span>{b.guestCount || (b.guests?.length || 0)}</span>
                          </div>

                          {b.totalAmount > 0 && (
                            <div style={s.cardRow}>
                              <span style={s.label}>💰 Amount</span>
                              <span>₹{b.totalAmount.toLocaleString()}</span>
                            </div>
                          )}

                          {b.cuisines?.length > 0 && (
                            <div style={s.cuisineRow}>
                              {b.cuisines.map(c => (
                                <span key={c} style={s.cuisineChip}>🍽️ {c}</span>
                              ))}
                            </div>
                          )}

                          {b.specialNote && <p style={s.note}>📝 {b.specialNote}</p>}

                          {status !== "completed" && status !== "cancelled" && (
                            <button style={s.cancelBtn} onClick={() => cancelBooking(b._id)}>
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        )}

        {/* NEW BOOKING */}
        {tab === "new" && (
          <BookingForm onSuccess={() => { setTab("bookings"); fetchBookings(); }} />
        )}

        {/* MY CALENDAR & MAP */}
        {tab === "calendar" && (
          loading ? <p style={s.muted}>Loading...</p> :
          <AdminCalendarMap bookings={bookings} ownerName={user?.fullName} />
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <div style={s.formWrap}>
            <h2 style={s.pageTitle}>My Profile</h2>
            <form onSubmit={saveProfile} style={s.form}>
              <label style={s.lbl}>Full Name</label>
              <input style={s.inp} value={profile.fullName}
                onChange={e => setProfile({...profile, fullName:e.target.value})} />

              <label style={s.lbl}>Email</label>
              <input style={{...s.inp, opacity:0.6}} value={user?.email} disabled />

              <label style={s.lbl}>Phone Number</label>
              <input style={s.inp} placeholder="Update phone number"
                value={profile.phoneNumber}
                onChange={e => setProfile({...profile, phoneNumber:e.target.value})} />

              <button type="submit" style={s.submitBtn}>💾 Save Changes</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page:       { display:"flex", minHeight:"100vh", background:"#f5f0ff", fontFamily:"sans-serif" },
  sidebar:    { width:240, background:"linear-gradient(160deg,#4a0080,#1a0050)",
                display:"flex", flexDirection:"column", padding:"32px 0", position:"sticky", top:0, height:"100vh" },
  sideTop:    { padding:"0 24px 24px", borderBottom:"1px solid rgba(255,255,255,0.1)", marginBottom:16 },
  avatar:     { width:56, height:56, borderRadius:"50%",
                background:"linear-gradient(135deg,#7B2FBE,#2979FF)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:24, fontWeight:700, color:"#fff", marginBottom:12 },
  username:   { color:"#fff", fontWeight:700, margin:0, fontSize:15 },
  email:      { color:"rgba(255,255,255,0.5)", fontSize:12, margin:"4px 0 0" },
  nav:        { flex:1, padding:"0 12px", display:"flex", flexDirection:"column", gap:4 },
  navBtn:     { background:"transparent", border:"none", color:"rgba(255,255,255,0.7)",
                padding:"12px 16px", borderRadius:10, cursor:"pointer",
                textAlign:"left", fontSize:14, fontWeight:500, transition:"all 0.2s" },
  navActive:  { background:"rgba(255,255,255,0.15)", color:"#fff", fontWeight:700 },
  logoutBtn:  { margin:"16px 12px 0", background:"rgba(255,107,107,0.15)",
                border:"1px solid rgba(255,107,107,0.4)", color:"#ff9999",
                padding:"10px 16px", borderRadius:10, cursor:"pointer", fontSize:14 },
  main:       { flex:1, padding:"40px 48px", overflowY:"auto" },
  pageTitle:  { fontSize:"1.7rem", fontWeight:800, color:"#1a0050", marginBottom:28 },
  msgBox:     { background:"rgba(123,47,190,0.1)", border:"1px solid rgba(123,47,190,0.3)",
                borderRadius:10, padding:"12px 16px", color:"#4a0080",
                marginBottom:20, fontSize:14 },
  muted:      { color:"#888", fontSize:15 },
  empty:      { textAlign:"center", padding:"60px 20px", color:"#888" },
  cta:        { background:"linear-gradient(135deg,#7B2FBE,#2979FF)", color:"#fff",
                border:"none", borderRadius:25, padding:"12px 28px",
                fontSize:14, fontWeight:700, cursor:"pointer", marginTop:16 },

  grid:       { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:22 },
  card:       { background:"#fff", borderRadius:18, overflow:"hidden",
                boxShadow:"0 4px 20px rgba(0,0,0,0.07)",
                border:"1px solid rgba(123,47,190,0.07)" },

  cardImageWrap: { position:"relative", height:160, overflow:"hidden" },
  cardImage:     { width:"100%", height:"100%", objectFit:"cover", display:"block" },
  cardImageOverlay: {
    position:"absolute", inset:0,
    background:"linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
  },
  statusBadge: {
    position:"absolute", top:12, right:12,
    color:"#1a1a2e", fontSize:11, fontWeight:800,
    padding:"4px 12px", borderRadius:20, letterSpacing:0.3,
  },
  typeChip: {
    position:"absolute", bottom:12, left:12,
    color:"#fff", fontSize:12, fontWeight:700,
    padding:"5px 14px", borderRadius:20,
  },

  cardBody:   { padding:"18px 20px 20px" },
  bookerName: { fontSize:12, color:"#888", fontWeight:600, margin:"0 0 4px" },
  cardTitle:  { fontSize:17, fontWeight:800, color:"#1a0050", margin:"0 0 14px" },
  cardRow:    { display:"flex", justifyContent:"space-between", fontSize:13,
                color:"#444", marginBottom:8, gap:8 },
  label:      { color:"#999", fontWeight:600, flexShrink:0 },
  venueText:  { textAlign:"right", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:170 },

  cuisineRow: { display:"flex", flexWrap:"wrap", gap:5, marginTop:10 },
  cuisineChip:{ fontSize:10, padding:"3px 9px", borderRadius:12,
                background:"#f0ebff", color:"#7B2FBE", fontWeight:600 },
  note:       { fontSize:12, color:"#888", marginTop:10, fontStyle:"italic", lineHeight:1.5 },

  cancelBtn:  { marginTop:16, width:"100%", padding:"10px",
                background:"rgba(255,107,107,0.1)", border:"1px solid #FF6B6B",
                color:"#c0392b", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:700 },

  formWrap:   { maxWidth:520 },
  form:       { background:"#fff", borderRadius:16, padding:"32px",
                boxShadow:"0 4px 20px rgba(0,0,0,0.06)" },
  lbl:        { display:"block", fontSize:13, fontWeight:600, color:"#4a0080", marginBottom:6 },
  inp:        { width:"100%", padding:"12px 16px", borderRadius:10,
                border:"1.5px solid #e0d6ff", fontSize:14, marginBottom:18,
                outline:"none", boxSizing:"border-box", fontFamily:"sans-serif" },
  submitBtn:  { width:"100%", padding:"14px",
                background:"linear-gradient(135deg,#7B2FBE,#2979FF)",
                color:"#fff", fontSize:16, fontWeight:700,
                border:"none", borderRadius:12, cursor:"pointer",
                boxShadow:"0 6px 20px rgba(123,47,190,0.3)" },
};

const css = `
  input:focus, select:focus, textarea:focus {
    border-color: #7B2FBE !important;
    box-shadow: 0 0 0 3px rgba(123,47,190,0.1);
  }
`;