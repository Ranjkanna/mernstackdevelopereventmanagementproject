import React, { useState, useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const STATUS_COLOR = { upcoming:"#E8B86D", completed:"#4ECDC4", cancelled:"#FF6B6B" };
const TYPE_ICON = {
  Wedding:"💍", Birthday:"🎂", Corporate:"🏢",
  Graduation:"🎓", Reception:"💃", "Custom Event":"🌟",
};

const DEFAULT_CENTER = [10.9, 78.5]; // Tamil Nadu center


function autoStatus(b) {
  if (b?.status === "cancelled") return "cancelled";
  if (!b?.date) return "upcoming";
  return new Date(b.date) < new Date() ? "completed" : "upcoming";
}

export default function AdminCalendarMap({ bookings, ownerName }) {
  const today = new Date();
  const [viewMonth,    setViewMonth]    = useState(today.getMonth());
  const [viewYear,     setViewYear]     = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [searchLoading,setSearchLoading]= useState(false);
  const [searchError,  setSearchError]  = useState("");

  const mapContainerRef = useRef(null);
  const mapInstanceRef  = useRef(null);
  const markerLayerRef  = useRef(null);

  // ── CALENDAR LOGIC ────────────────────────────────────────────────────────
  const bookingsByDate = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      if (!b.date) return;
      const key = new Date(b.date).toISOString().split("T")[0];
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    return map;
  }, [bookings]);

  const firstDay   = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth= new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthName  = new Date(viewYear, viewMonth).toLocaleString("en-US", { month:"long" });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear-1); }
    else setViewMonth(viewMonth-1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear+1); }
    else setViewMonth(viewMonth+1);
  };

  const dateKey = (d) => {
    const m   = String(viewMonth+1).padStart(2,"0");
    const day = String(d).padStart(2,"0");
    return `${viewYear}-${m}-${day}`;
  };

  
  const withLocation = useMemo(() =>
    bookings.filter(b =>
      b.coords?.lat && b.coords?.lng && autoStatus(b) === "upcoming"
    ),
  [bookings]);

  const mapBookings = useMemo(() =>
    selectedDate
      ? withLocation.filter(b => new Date(b.date).toISOString().split("T")[0] === selectedDate)
      : withLocation,
  [selectedDate, withLocation]);

  // ── INIT LEAFLET MAP ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:'© <a href="https://www.openstreetmap.org">OpenStreetMap</a>',
    }).addTo(map);

    const markerLayer = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markerLayerRef.current = markerLayer;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ── UPDATE MARKERS ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !markerLayerRef.current) return;
    markerLayerRef.current.clearLayers();

    mapBookings.forEach((b) => {
      const icon     = TYPE_ICON[b.event] || "🌟";
      const status   = autoStatus(b);
      const color    = STATUS_COLOR[status] || "#E8B86D";
      const booker   = b.userId?.fullName || ownerName || "You";

      const customIcon = L.divIcon({
        className: "",
        html: `<div style="position:relative;display:inline-block;">
          <div style="font-size:28px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35));">📍</div>
          <span style="position:absolute;top:-2px;left:50%;transform:translateX(-50%);
            background:#fff;border-radius:50%;width:18px;height:18px;
            display:flex;align-items:center;justify-content:center;
            font-size:11px;border:2px solid ${color};box-shadow:0 1px 4px rgba(0,0,0,0.2);">
            ${icon}
          </span>
        </div>`,
        iconSize:    [30, 42],
        iconAnchor:  [15, 42],
        popupAnchor: [0, -44],
      });

      const popup = `
        <div style="font-family:sans-serif;padding:4px;min-width:180px;">
          <div style="font-weight:800;font-size:13px;color:#1a0050;margin-bottom:4px;">
            ${icon} ${b.event}
          </div>
          <div style="font-size:12px;color:#555;margin-bottom:2px;">👤 ${booker}</div>
          <div style="font-size:12px;color:#555;margin-bottom:2px;">📍 ${b.location || "No address"}</div>
          <div style="font-size:12px;color:#555;margin-bottom:6px;">
            📅 ${b.date ? new Date(b.date).toLocaleDateString() : "—"}
            ${b.time ? ` · 🕐 ${b.time}` : ""}
          </div>
          <span style="display:inline-block;padding:3px 10px;border-radius:12px;
            background:${color};font-size:10px;font-weight:700;color:#1a1a2e;">
            ${status.toUpperCase()}
          </span>
          <br/><br/>
          <a href="https://www.google.com/maps?q=${b.coords.lat},${b.coords.lng}"
            target="_blank"
            style="font-size:11px;color:#2979FF;font-weight:700;text-decoration:none;">
            🔗 Open in Google Maps ↗
          </a>
        </div>`;

      L.marker([b.coords.lat, b.coords.lng], { icon: customIcon })
        .bindPopup(popup)
        .addTo(markerLayerRef.current);
    });

    // Auto-fit map to show all markers
    if (mapBookings.length > 0 && mapInstanceRef.current) {
      const group = L.featureGroup(
        mapBookings.map(b => L.marker([b.coords.lat, b.coords.lng]))
      );
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.3), { maxZoom:14 });
    }
  }, [mapBookings, ownerName]);

  // ── MAP SEARCH (pan to city) ──────────────────────────────────────────────
  const handleMapSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError("");
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        mapInstanceRef.current?.flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)], 13, { animate:true, duration:1.5 });
      } else {
        setSearchError("Location not found.");
      }
    } catch { setSearchError("Network error."); }
    finally { setSearchLoading(false); }
  };

  return (
    <div>
      <style>{css}</style>
      <h2 style={s.title}>Bookings Calendar & Map</h2>
      <p style={s.sub}>
        {selectedDate
          ? `Showing: ${new Date(selectedDate).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}`
          : "Click a date to filter map pins"}
        {selectedDate && (
          <button style={s.clearBtn} onClick={() => setSelectedDate(null)}>✕ Clear</button>
        )}
      </p>

      <div className="acm-grid" style={s.grid}>

        {/* ── CALENDAR ── */}
        <div style={s.calCard}>
          <div style={s.calHeader}>
            <button style={s.navBtn} onClick={prevMonth}>‹</button>
            <h3 style={s.monthLabel}>{monthName} {viewYear}</h3>
            <button style={s.navBtn} onClick={nextMonth}>›</button>
          </div>

          <div style={s.weekRow}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
              <div key={d} style={s.weekDay}>{d}</div>
            ))}
          </div>

          <div style={s.daysGrid}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} style={s.emptyCell} />;
              const key         = dateKey(d);
              const dayBookings = bookingsByDate[key] || [];
              const isToday     = key === today.toISOString().split("T")[0];
              const isSelected  = key === selectedDate;

              return (
                <div key={i}
                  style={{
                    ...s.dayCell,
                    ...(isToday ? s.todayCell : {}),
                    ...(isSelected ? s.selectedCell : {}),
                    ...(dayBookings.length > 0 ? { cursor:"pointer" } : {}),
                  }}
                  onClick={() => dayBookings.length > 0 && setSelectedDate(isSelected ? null : key)}
                >
                  <span style={{ ...s.dayNum, color: isSelected ? "#fff" : "#333" }}>{d}</span>
                  {dayBookings.length > 0 && (
                    <div style={s.dayDots}>
                      {dayBookings.slice(0,3).map((b,idx) => (
                        <span key={idx} style={{ ...s.dot, background: STATUS_COLOR[autoStatus(b)] }} />
                      ))}
                      {dayBookings.length > 3 && (
                        <span style={{ ...s.moreDot, color: isSelected ? "#fff" : "#888" }}>
                          +{dayBookings.length-3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={s.legend}>
            <span style={s.legendItem}><span style={{ ...s.dot, background:"#E8B86D" }} /> Upcoming</span>
            <span style={s.legendItem}><span style={{ ...s.dot, background:"#4ECDC4" }} /> Completed</span>
            <span style={s.legendItem}><span style={{ ...s.dot, background:"#FF6B6B" }} /> Cancelled</span>
          </div>
        </div>

        {/* ── MAP ── */}
        <div style={s.mapCard}>
          <div style={s.mapHeaderRow}>
            <h3 style={s.mapTitle}>📍 Venue Locations ({mapBookings.length})</h3>
            <form onSubmit={handleMapSearch} style={s.searchForm}>
              <input type="text" placeholder="Search location..."
                value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                style={s.searchInput} />
              <button type="submit" disabled={searchLoading} style={s.searchBtn}>
                {searchLoading ? "⌛" : "🔍"}
              </button>
            </form>
          </div>

          {searchError && <p style={s.errorMsg}>{searchError}</p>}

          <div ref={mapContainerRef} style={s.leafletFrame} />

          <div style={s.bookingList}>
            {mapBookings.map(b => (
              <div key={b._id} style={s.bookingItem}>
                <span style={{ fontSize:20 }}>{TYPE_ICON[b.event] || "🌟"}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={s.biTitle}>{b.event} — {b.userId?.fullName || ownerName || "You"}</p>
                  <p style={s.biSub}>
                    📅 {b.date ? new Date(b.date).toLocaleDateString() : "—"} · 📍 {b.location}
                  </p>
                </div>
                <a href={`https://www.google.com/maps?q=${b.coords.lat},${b.coords.lng}`}
                  target="_blank" rel="noreferrer" style={s.mapLink}>
                  Open Map ↗
                </a>
              </div>
            ))}
            {mapBookings.length === 0 && (
              <div style={s.mapEmpty}>
                {withLocation.length === 0
                  ? "No bookings have map coordinates yet. Use 'Paste coordinates' when creating a booking to enable map pins."
                  : "No bookings with coordinates for this date."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  title:     { fontSize:"1.7rem", fontWeight:800, color:"#1a0050", marginBottom:6 },
  sub:       { fontSize:13, color:"#888", marginBottom:24 },
  clearBtn:  { marginLeft:12, background:"rgba(255,107,107,0.1)", border:"1px solid #FF6B6B",
               color:"#c0392b", borderRadius:14, padding:"3px 12px", fontSize:11, fontWeight:700, cursor:"pointer" },
  grid:      { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 },

  calCard:   { background:"#fff", borderRadius:16, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,0.06)", height:"fit-content" },
  calHeader: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 },
  navBtn:    { width:32, height:32, borderRadius:"50%", border:"1px solid #e0d6ff", background:"#fff", color:"#7B2FBE", fontSize:18, fontWeight:700, cursor:"pointer" },
  monthLabel:{ fontSize:16, fontWeight:700, color:"#1a0050", margin:0 },
  weekRow:   { display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:6 },
  weekDay:   { textAlign:"center", fontSize:11, fontWeight:700, color:"#aaa", padding:"4px 0" },
  daysGrid:  { display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 },
  emptyCell: { aspectRatio:"1" },
  dayCell:   { aspectRatio:"1", borderRadius:10, border:"1px solid #f0ebff",
               display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
               padding:4, transition:"all 0.15s", position:"relative" },
  todayCell: { border:"1.5px solid #7B2FBE", background:"#faf8ff" },
  selectedCell: { background:"linear-gradient(135deg,#7B2FBE,#2979FF)", border:"none" },
  dayNum:    { fontSize:13, fontWeight:600 },
  dayDots:   { display:"flex", gap:2, marginTop:3, flexWrap:"wrap", justifyContent:"center" },
  dot:       { width:6, height:6, borderRadius:"50%", display:"inline-block" },
  moreDot:   { fontSize:9, fontWeight:700 },
  legend:    { display:"flex", gap:14, marginTop:16, flexWrap:"wrap" },
  legendItem:{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#888" },

  mapCard:      { background:"#fff", borderRadius:16, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", gap:12 },
  mapHeaderRow: { display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap" },
  mapTitle:     { fontSize:15, fontWeight:700, color:"#1a0050", margin:0 },
  searchForm:   { display:"flex", gap:4, background:"#fff", padding:3, borderRadius:20, border:"1px solid #e0d6ff" },
  searchInput:  { border:"none", outline:"none", padding:"4px 10px", borderRadius:15, fontSize:12, width:160, fontWeight:600 },
  searchBtn:    { background:"linear-gradient(135deg,#7B2FBE,#2979FF)", color:"#fff", border:"none", borderRadius:"50%", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, cursor:"pointer" },
  errorMsg:     { color:"#FF6B6B", fontSize:11, fontWeight:600, margin:0 },
  leafletFrame: { width:"100%", height:260, borderRadius:12, border:"1px solid #e0d6ff", zIndex:1 },
  mapEmpty:     { textAlign:"center", padding:"20px 0", color:"#aaa", fontSize:13, lineHeight:1.6 },
  bookingList:  { display:"flex", flexDirection:"column", gap:10, maxHeight:200, overflowY:"auto", marginTop:4 },
  bookingItem:  { display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, background:"#faf8ff", border:"1px solid rgba(123,47,190,0.06)" },
  biTitle:      { fontSize:13, fontWeight:700, color:"#1a0050", margin:0 },
  biSub:        { fontSize:11, color:"#888", margin:"2px 0 0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  mapLink:      { fontSize:11, color:"#2979FF", fontWeight:700, textDecoration:"none", whiteSpace:"nowrap" },
};

const css = `
  @media(max-width:900px){ .acm-grid { grid-template-columns: 1fr !important; } }
  .custom-leaflet-pin { background: transparent !important; border: none !important; }
`;