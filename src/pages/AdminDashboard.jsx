import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import AdminCalendarMap from "../components/AdminCalendarMap";
import BookingForm from "../components/BookingForm";
// NOTE: adjust this path if BookingForm lives somewhere else in your project.

const EVENT_TYPES = ["All", "Wedding","Birthday","Corporate","Graduation","Reception","Custom Event"];
const STATUSES     = ["All", "upcoming", "completed", "cancelled"];

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
const STATUS_COLOR = { upcoming:"#E8B86D", completed:"#4ECDC4", cancelled:"#FF6B6B" };

function autoStatus(b) {
  if (b.status === "cancelled") return "cancelled";
  if (!b.date) return "upcoming";
  return new Date(b.date) < new Date() ? "completed" : "upcoming";
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab,      setTab]      = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState("");

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType,   setFilterType]   = useState("All");
  // the booking currently open for inline editing, or null when none.
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (b) => {
    setEditingBooking(b);
    setEditForm({
      name:        b.name || '',
      date:        b.date ? b.date.slice(0,10) : '',
      time:        b.time || '',
      endTime:     b.endTime || '',
      guestCount:  b.guestCount ?? '',
      totalAmount: b.totalAmount ?? '',
      specialNote: b.specialNote || '',
    });
  };
  const cancelEdit = () => { setEditingBooking(null); setEditForm({}); };

  const headers = { Authorization: `Bearer ${user?.token}` };

  // NOTE: `silent` lets background/interval refreshes update the bookings
  // array without toggling the page-level `loading` flag. When `loading`
  // flips to true, the bookings tab swaps the entire card grid for a
  // "Loading..." line — collapsing the scrollable <main> container and
  // resetting scroll position to the top. Passing silent=true skips that
  // so periodic refreshes don't yank the admin back to the top of the page.
  const fetchBookings = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await axios.get("/api/admin/events", { headers });
      // ✅ Sort: upcoming first (nearest date), then completed, then cancelled
      const sorted = res.data.sort((a, b) => {
        const statusOrder = { upcoming: 0, completed: 1, cancelled: 2 };
        const statusA = autoStatus(a);
        const statusB = autoStatus(b);
        if (statusA !== statusB) return statusOrder[statusA] - statusOrder[statusB];
        return new Date(a.date) - new Date(b.date);
      });
      setBookings(sorted);
    } catch { setMsg("Failed to load bookings"); }
    finally { if (!silent) setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/users", { headers });
      setUsers(res.data);
    } catch { setMsg("Failed to load users"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (tab === "bookings" || tab === "overview" || tab === "calendar") fetchBookings();
    if (tab === "users" || tab === "newBooking") fetchUsers();
  }, [tab]);

  // ✅ auto-refresh bookings every 15s while on Overview/Bookings/Calendar
  //    so cancellations made by users elsewhere show up without manual reload.
  //    silent=true keeps this from resetting scroll position (see fetchBookings).
  useEffect(() => {
    if (tab !== "overview" && tab !== "bookings" && tab !== "calendar") return;
    const interval = setInterval(() => fetchBookings(true), 15000);
    return () => clearInterval(interval);
  }, [tab]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const status = autoStatus(b);
      const matchStatus = filterStatus === "All" || status === filterStatus;
      const matchType   = filterType   === "All" || b.event === filterType;
      return matchStatus && matchType;
    });
  }, [bookings, filterStatus, filterType]);

  const stats = useMemo(() => {
    const upcoming  = bookings.filter(b => autoStatus(b) === "upcoming").length;
    const completed = bookings.filter(b => autoStatus(b) === "completed").length;
    const cancelled = bookings.filter(b => autoStatus(b) === "cancelled").length;
    const revenue   = bookings
      .filter(b => autoStatus(b) === "completed")
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { total: bookings.length, upcoming, completed, cancelled, revenue };
  }, [bookings]);

  const changeStatus = async (id, status) => {
    try {
      await axios.put(`/api/events/${id}`, { status }, { headers });
      setMsg(`Status updated to ${status}`);
      fetchBookings();
    } catch { setMsg("Failed to update status"); }
  };

  // saves inline edits made directly on an event card (Save button).
  const updateBooking = async (id, fields) => {
    try {
      const payload = { ...fields, guestCount: Number(fields.guestCount) || 0, totalAmount: Number(fields.totalAmount) || 0 };
      await axios.put(`/api/events/${id}`, payload, { headers });
      setMsg("Booking updated.");
      cancelEdit();
      fetchBookings();
    } catch { setMsg("Failed to update booking"); }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await axios.delete(`/api/admin/users/${id}`, { headers });
      setMsg(`User "${name}" deleted.`);
      fetchUsers();
    } catch { setMsg("Failed to delete user"); }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <span style={s.brandIcon}>👑</span>
          <div>
            <p style={s.brandName}>Admin Panel</p>
            <p style={s.brandSub}>Event Planner</p>
          </div>
        </div>

        <nav style={s.nav}>
          {[
            { id:"overview",   icon:"📊", label:"Overview"      },
            { id:"bookings",   icon:"📋", label:"All Bookings"  },
            { id:"newBooking", icon:"➕", label:"New Booking"   },
            { id:"calendar",   icon:"🗺️", label:"Calendar & Map" },
            { id:"users",      icon:"👥", label:"All Users"     },
          ].map(n => (
            <button key={n.id}
              style={{ ...s.navBtn, ...(tab===n.id ? s.navActive:{}) }}
              onClick={() => { setTab(n.id); setMsg(""); }}>
              {n.icon}&nbsp; {n.label}
            </button>
          ))}
        </nav>

        <div style={s.adminInfo}>
          <p style={s.adminName}>{user?.fullName}</p>
          <p style={s.adminEmail}>{user?.email}</p>
        </div>
        <button style={s.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
      </aside>

      {/* ── Main ── */}
      <main style={s.main}>
        {msg && <div style={s.msgBox} onClick={() => setMsg("")}>{msg} ✕</div>}

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <h2 style={s.pageTitle}>Dashboard Overview</h2>
              <button style={s.refreshBtn} onClick={() => fetchBookings()} disabled={loading}>
                🔄 {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            <div style={s.statGrid}>
              <StatCard icon="📋" label="Total Bookings" value={stats.total}     color="#7B2FBE" />
              <StatCard icon="⏳" label="Upcoming"        value={stats.upcoming} color="#E8B86D" />
              <StatCard icon="✅" label="Completed"       value={stats.completed} color="#4ECDC4" />
              <StatCard icon="❌" label="Cancelled"       value={stats.cancelled} color="#FF6B6B" />
              <StatCard icon="💰" label="Revenue (Completed)"
                value={`₹${stats.revenue.toLocaleString()}`} color="#2979FF" wide />
            </div>

            <h3 style={{ ...s.pageTitle, fontSize:"1.2rem", marginTop:36 }}>Quick Actions</h3>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <button style={s.qaBtn} onClick={() => setTab("bookings")}>📋 Manage Bookings</button>
              <button style={s.qaBtn} onClick={() => setTab("newBooking")}>➕ New Booking</button>
              <button style={s.qaBtn} onClick={() => setTab("calendar")}>🗺️ Calendar & Map</button>
              <button style={s.qaBtn} onClick={() => setTab("users")}>👥 Manage Users</button>
            </div>
          </div>
        )}

        {/* NEW BOOKING — admin creates a booking directly */}
        {tab === "newBooking" && (
          <div>
            <h2 style={s.pageTitle}>New Booking</h2>
            <div style={s.formPanel}>
              <BookingForm onSuccess={() => { setTab("bookings"); }} />
            </div>
          </div>
        )}

        {/* ALL BOOKINGS — EVENT CARDS */}
        {tab === "bookings" && (
          <div>
            <h2 style={s.pageTitle}>All Bookings ({filteredBookings.length})</h2>

            {/* ── Filters ── */}
            <div style={s.filterRow}>
              <div>
                <label style={s.filterLbl}>Status</label>
                <div style={s.filterPills}>
                  {STATUSES.map(st => (
                    <button key={st}
                      style={{ ...s.pill, ...(filterStatus===st ? s.pillActive : {}) }}
                      onClick={() => setFilterStatus(st)}>
                      {st === "All" ? "All" : st.charAt(0).toUpperCase()+st.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={s.filterLbl}>Event Type</label>
                <div style={s.filterPills}>
                  {EVENT_TYPES.map(t => (
                    <button key={t}
                      style={{ ...s.pill, ...(filterType===t ? s.pillActive : {}) }}
                      onClick={() => setFilterType(t)}>
                      {t !== "All" && (TYPE_ICON[t] + " ")}{t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? <p style={s.muted}>Loading...</p> : (
              filteredBookings.length === 0 ? (
                <p style={s.muted}>No bookings match these filters.</p>
              ) : (
                <div style={s.grid}>
                  {filteredBookings.map(b => {
                    const type   = b.event || "Custom Event";
                    const image  = b.image || TYPE_IMAGES[type] || TYPE_IMAGES["Custom Event"];
                    const color  = TYPE_COLORS[type] || "#5B4FE8";
                    const icon   = TYPE_ICON[type] || "🌟";
                    const status = autoStatus(b);
                    const d      = b.date ? new Date(b.date) : null;
                    const isEditingThis = editingBooking?._id === b._id;

                    return (
                      <div key={b._id} style={s.card}>
                        {/* Image header */}
                        <div style={s.cardImageWrap}>
                          <img src={image} alt={type} style={s.cardImage}
                            onError={e => { e.target.src = TYPE_IMAGES["Custom Event"]; }} />
                          <div style={s.cardImageOverlay} />
                          <span style={{
                            ...s.statusBadge,
                            background: STATUS_COLOR[status],
                          }}>
                            {status === "upcoming" ? "● UPCOMING" :
                             status === "completed" ? "✔ COMPLETED" : "✕ CANCELLED"}
                          </span>
                          <span style={{ ...s.typeChip, background: color }}>
                            {icon} {type}
                          </span>
                        </div>

                        {/* Body */}
                        <div style={s.cardBody}>
                          {/* Booker info */}
                          <div style={s.bookerBox}>
                            <div style={s.bookerAvatar}>
                              {b.userId?.fullName?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <p style={s.bookerName}>{b.userId?.fullName || "Unknown"}</p>
                              <p style={s.bookerEmail}>{b.userId?.email}</p>
                            </div>
                          </div>

                          {!isEditingThis ? (
                            // ── NORMAL (read-only) VIEW ──
                            <>
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

                              <div style={s.cardRow}>
                                <span style={s.label}>📱 Phone</span>
                                <span>{b.userId?.phoneNumber || "—"}</span>
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
                            </>
                          ) : (
                            // ── INLINE EDIT VIEW — replaces the fields above with inputs ──
                            (() => {
                              const set = (key) => (e) => setEditForm(f => ({ ...f, [key]: e.target.value }));
                              return (
                                <div style={s.editBox}>
                                  <label style={s.editLbl}>Venue Name</label>
                                  <input style={s.editInput} value={editForm.name} onChange={set('name')} />

                                  <div style={{ display:'flex', gap:8 }}>
                                    <div style={{ flex:1 }}>
                                      <label style={s.editLbl}>Date</label>
                                      <input type="date" style={s.editInput} value={editForm.date} onChange={set('date')} />
                                    </div>
                                    <div style={{ flex:1 }}>
                                      <label style={s.editLbl}>Start</label>
                                      <input type="time" style={s.editInput} value={editForm.time} onChange={set('time')} />
                                    </div>
                                    <div style={{ flex:1 }}>
                                      <label style={s.editLbl}>End</label>
                                      <input type="time" style={s.editInput} value={editForm.endTime} onChange={set('endTime')} />
                                    </div>
                                  </div>

                                  <div style={{ display:'flex', gap:8 }}>
                                    <div style={{ flex:1 }}>
                                      <label style={s.editLbl}>Guests</label>
                                      <input type="number" min="1" style={s.editInput} value={editForm.guestCount} onChange={set('guestCount')} />
                                    </div>
                                    <div style={{ flex:1 }}>
                                      <label style={s.editLbl}>Budget (₹)</label>
                                      <input type="number" min="0" style={s.editInput} value={editForm.totalAmount} onChange={set('totalAmount')} />
                                    </div>
                                  </div>

                                  <label style={s.editLbl}>Special Notes</label>
                                  <textarea style={{ ...s.editInput, resize:'none', height:56 }}
                                    value={editForm.specialNote} onChange={set('specialNote')} />

                                  <p style={s.editHint}>
                                    📍 Venue location on the map isn't editable here — use "New Booking" for full location control.
                                  </p>
                                </div>
                              );
                            })()
                          )}

                          {/* Admin actions — only shown for upcoming bookings (or the one
                              currently being edited). Completed / cancelled cards are
                              read-only records, so no action row renders for them at all. */}
                          {(isEditingThis || status === "upcoming") && (
                            <div style={s.actionRow}>
                              {isEditingThis ? (
                                <>
                                  <button style={s.actBtn("#4ECDC4")}
                                    onClick={() => updateBooking(b._id, editForm)}>💾 Save</button>
                                  <button style={s.actBtn("#999")}
                                    onClick={cancelEdit}>✕ Cancel</button>
                                </>
                              ) : (
                                <>
                                  <button style={s.actBtn("#5B4FE8")}
                                    onClick={() => startEdit(b)}>✏️ Edit</button>
                                  <button style={s.actBtn("#4ECDC4")}

                                    onClick={() => changeStatus(b._id,"cancelled")}>❌ Cancel</button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}

        {/* CALENDAR & MAP */}
        {tab === "calendar" && (
          loading ? <p style={s.muted}>Loading...</p> :
          <AdminCalendarMap bookings={bookings} />
        )}

        {/* ALL USERS */}
        {tab === "users" && (
          <div>
            <h2 style={s.pageTitle}>All Users ({users.length})</h2>
            {loading ? <p style={s.muted}>Loading...</p> : (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr style={s.thead}>
                      <Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Role</Th><Th>Action</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id} style={{ background: i%2===0?"#fff":"#faf8ff" }}>
                        <Td>
                          <div style={s.userAvatar}>
                            <div style={s.avatarCircle}>{u.fullName?.[0]?.toUpperCase()}</div>
                            <span style={s.tdName}>{u.fullName}</span>
                          </div>
                        </Td>
                        <Td>{u.email}</Td>
                        <Td>{u.phoneNumber}</Td>
                        <Td>
                          <span style={{ ...s.badge,
                            background: u.isAdmin ? "#7B2FBE" : "#e0e0e0",
                            color: u.isAdmin ? "#fff" : "#333" }}>
                            {u.isAdmin ? "👑 Admin" : "👤 User"}
                          </span>
                        </Td>
                        <Td>
                          {!u.isAdmin && (
                            <button style={s.delBtn} onClick={() => deleteUser(u._id, u.fullName)}>🗑 Delete</button>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p style={s.muted}>No users yet.</p>}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color, wide }) {
  return (
    <div style={{ ...sc.card, gridColumn: wide ? "span 2" : "span 1", borderTop:`4px solid ${color}` }}>
      <span style={{ fontSize:28 }}>{icon}</span>
      <p style={{ fontSize:"1.9rem", fontWeight:800, color, margin:"8px 0 4px" }}>{value}</p>
      <p style={{ color:"#888", fontSize:13, margin:0 }}>{label}</p>
    </div>
  );
}
const sc = { card: { background:"#fff", borderRadius:14, padding:"24px 20px", textAlign:"center", boxShadow:"0 4px 16px rgba(0,0,0,0.06)" } };

function Th({ children }) {
  return <th style={{ padding:"12px 16px", textAlign:"left", fontSize:12,
    fontWeight:700, color:"#7B2FBE", textTransform:"uppercase", letterSpacing:0.5,
    borderBottom:"2px solid #e0d6ff", whiteSpace:"nowrap" }}>{children}</th>;
}
function Td({ children }) {
  return <td style={{ padding:"12px 16px", fontSize:13, color:"#333",
    borderBottom:"1px solid #f0ebff", verticalAlign:"middle" }}>{children}</td>;
}

const s = {
  page:      { display:"flex", minHeight:"100vh", background:"#f5f0ff", fontFamily:"sans-serif" },
  sidebar:   { width:240, background:"linear-gradient(160deg,#1a0050,#0d0030)",
               display:"flex", flexDirection:"column", padding:"24px 0",
               position:"sticky", top:0, height:"100vh" },
  brand:     { display:"flex", alignItems:"center", gap:12,
               padding:"0 20px 24px", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:16 },
  brandIcon: { fontSize:28 },
  brandName: { color:"#fff", fontWeight:800, margin:0, fontSize:15 },
  brandSub:  { color:"rgba(255,255,255,0.4)", margin:0, fontSize:11 },
  nav:       { flex:1, padding:"0 10px", display:"flex", flexDirection:"column", gap:4 },
  navBtn:    { background:"transparent", border:"none", color:"rgba(255,255,255,0.65)",
               padding:"12px 14px", borderRadius:10, cursor:"pointer",
               textAlign:"left", fontSize:14, fontWeight:500, transition:"all 0.2s" },
  navActive: { background:"rgba(123,47,190,0.4)", color:"#fff", fontWeight:700 },
  adminInfo: { padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.08)" },
  adminName: { color:"#fff", fontWeight:600, margin:0, fontSize:13 },
  adminEmail:{ color:"rgba(255,255,255,0.4)", margin:"4px 0 0", fontSize:11 },
  logoutBtn: { margin:"12px 10px 0", background:"rgba(255,107,107,0.15)",
               border:"1px solid rgba(255,107,107,0.35)", color:"#ff9999",
               padding:"10px", borderRadius:10, cursor:"pointer", fontSize:13 },
  main:      { flex:1, padding:"36px 40px", overflowY:"auto" },
  pageTitle: { fontSize:"1.7rem", fontWeight:800, color:"#1a0050", marginBottom:24 },
  msgBox:    { background:"rgba(123,47,190,0.1)", border:"1px solid rgba(123,47,190,0.3)",
               borderRadius:10, padding:"12px 16px", color:"#4a0080",
               marginBottom:20, fontSize:14, cursor:"pointer" },
  muted:     { color:"#aaa", fontSize:14, marginTop:20 },
  statGrid:  { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 },

  formPanel: { background:"#fff", borderRadius:18, padding:"28px 24px",
               boxShadow:"0 4px 20px rgba(0,0,0,0.07)" },

  filterRow: { display:"flex", gap:32, marginBottom:24, flexWrap:"wrap" },
  filterLbl: { display:"block", fontSize:12, fontWeight:700, color:"#7B2FBE",
               textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 },
  filterPills: { display:"flex", gap:8, flexWrap:"wrap" },
  pill: {
    padding:"7px 16px", borderRadius:20, fontSize:13, fontWeight:600,
    border:"1.5px solid #e0d6ff", background:"#fff", color:"#666", cursor:"pointer",
    transition:"all 0.15s",
  },
  pillActive: {
    background:"linear-gradient(135deg,#7B2FBE,#2979FF)", color:"#fff", border:"none",
  },

  // ── Event cards (admin) ──
  grid:       { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:22 },
  card:       { background:"#fff", borderRadius:18, overflow:"hidden",
                boxShadow:"0 4px 20px rgba(0,0,0,0.07)",
                border:"1px solid rgba(123,47,190,0.07)" },
  cardImageWrap: { position:"relative", height:150, overflow:"hidden" },
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
  cardBody:   { padding:"16px 18px 18px" },

  bookerBox:    { display:"flex", alignItems:"center", gap:10, marginBottom:14,
                  paddingBottom:14, borderBottom:"1px solid #f0ebff" },
  bookerAvatar: { width:38, height:38, borderRadius:"50%", flexShrink:0,
                  background:"linear-gradient(135deg,#7B2FBE,#2979FF)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff", fontWeight:700, fontSize:15 },
  bookerName:   { fontSize:13, fontWeight:700, color:"#1a0050", margin:0 },
  bookerEmail:  { fontSize:11, color:"#999", margin:"2px 0 0" },

  cardTitle:  { fontSize:16, fontWeight:800, color:"#1a0050", margin:"0 0 12px" },
  cardRow:    { display:"flex", justifyContent:"space-between", fontSize:13,
                color:"#444", marginBottom:7, gap:8 },
  label:      { color:"#999", fontWeight:600, flexShrink:0 },
  venueText:  { textAlign:"right", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:170 },

  cuisineRow: { display:"flex", flexWrap:"wrap", gap:5, marginTop:10 },
  cuisineChip:{ fontSize:10, padding:"3px 9px", borderRadius:12,
                background:"#f0ebff", color:"#7B2FBE", fontWeight:600 },
  note:       { fontSize:12, color:"#888", marginTop:10, fontStyle:"italic", lineHeight:1.5 },

  actionRow:  { display:"flex", gap:6, flexWrap:"wrap", marginTop:16,
                paddingTop:14, borderTop:"1px solid #f0ebff" },
  actBtn: (c) => ({
    flex:1, padding:"8px 10px", borderRadius:8, border:`1px solid ${c}`,
    background:`${c}15`, color:c, fontSize:11, fontWeight:700,
    cursor:"pointer", whiteSpace:"nowrap",
  }),

  tableWrap: { overflowX:"auto", borderRadius:14,
               boxShadow:"0 4px 20px rgba(0,0,0,0.06)", background:"#fff" },
  table:     { width:"100%", borderCollapse:"collapse", minWidth:700 },
  thead:     { background:"#faf8ff" },
  badge:     { display:"inline-block", padding:"4px 12px", borderRadius:20,
               fontSize:11, fontWeight:700, color:"#1a1a2e", textTransform:"capitalize" },
  tdName:    { fontWeight:600, color:"#1a0050", margin:0, fontSize:13 },
  userAvatar:{ display:"flex", alignItems:"center", gap:10 },
  avatarCircle:{ width:32, height:32, borderRadius:"50%", flexShrink:0,
                 background:"linear-gradient(135deg,#7B2FBE,#2979FF)",
                 display:"flex", alignItems:"center", justifyContent:"center",
                 color:"#fff", fontWeight:700, fontSize:14 },
  delBtn:    { padding:"6px 14px", borderRadius:8, border:"1px solid #FF6B6B",
               background:"rgba(255,107,107,0.1)", color:"#c0392b",
               fontSize:12, fontWeight:700, cursor:"pointer" },
  qaBtn:     { background:"linear-gradient(135deg,#7B2FBE,#2979FF)", color:"#fff",
               border:"none", borderRadius:12, padding:"12px 24px",
               fontSize:14, fontWeight:700, cursor:"pointer" },
  refreshBtn:{ background:"#fff", border:"1.5px solid #e0d6ff", color:"#7B2FBE",
               borderRadius:20, padding:"8px 18px", fontSize:13, fontWeight:700,
               cursor:"pointer", height:"fit-content" },

  // inline card edit
  editBox:   { display:"flex", flexDirection:"column", gap:8, marginBottom:6 },
  editLbl:   { fontSize:10, fontWeight:700, color:"#7B2FBE", textTransform:"uppercase",
               letterSpacing:0.4, margin:"2px 0 2px" },
  editInput: { width:"100%", padding:"7px 10px", borderRadius:7,
               border:"1.5px solid #e0d6ff", outline:"none", fontSize:13,
               boxSizing:"border-box", fontFamily:"inherit" },
  editHint:  { fontSize:10.5, color:"#aaa", margin:"2px 0 0", fontStyle:"italic" },
};

const css = `
  @media(max-width:900px){ aside { display: none; } }
`;