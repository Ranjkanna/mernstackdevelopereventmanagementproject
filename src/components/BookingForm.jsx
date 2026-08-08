import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const CUISINES = [
  "North Indian","South Indian","Chinese","Continental",
  "Italian","Mughlai","Tandoori","Street Food",
  "Desserts & Bakery","Live Counters","Vegan","Jain"
];

function MapViewUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 16, { animate: true });
  }, [center[0], center[1]]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng); } });
  return null;
}

function getToken() {
  try {
    const ep = localStorage.getItem("epUser");
    if (ep) { const p = JSON.parse(ep); if (p.token) return p.token; }
  } catch {}
  return localStorage.getItem("token") || null;
}

export default function BookingForm({ onSuccess }) {
  const [eventType,       setEventType]       = useState('Wedding');
  const [eventDate,       setEventDate]       = useState('');
  const [startTime,       setStartTime]       = useState('');
  const [endTime,         setEndTime]         = useState('');
  const [venueName,       setVenueName]       = useState('');
  const [guestCount,      setGuestCount]      = useState('');
  const [budget,          setBudget]          = useState('');
  const [specialNotes,    setSpecialNotes]    = useState('');
  const [cuisines,        setCuisines]        = useState([]);
  const [guestInput,      setGuestInput]      = useState('');
  const [guestList,       setGuestList]       = useState([]);
  const [mapCenter,       setMapCenter]       = useState([10.3868, 77.9679]);
  const [pinCoords,       setPinCoords]       = useState(null);
  const [mapsLinkInput,   setMapsLinkInput]   = useState('');
  const [msg,             setMsg]             = useState({ type:'', text:'' });
  const [loading,         setLoading]         = useState(false);
  const dropRef = useRef(null);


  const parseGoogleMapsLink = (url) => {
    let match = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (!match) match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (!match) return null;
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  };

  const applyMapsLink = () => {
    if (!mapsLinkInput.trim()) return;
    if (mapsLinkInput.includes('maps.app.goo.gl') || mapsLinkInput.includes('goo.gl')) {
      setMsg({ type:'error', text:'❌ That\'s a shortened share link — open it once in a browser tab, then copy the full URL from the address bar instead.' });
      return;
    }
    const coords = parseGoogleMapsLink(mapsLinkInput);
    if (!coords) {
      setMsg({ type:'error', text:'❌ Could not read coordinates from that link. Copy the full page URL from Google Maps (the one with @lat,lng in it).' });
      return;
    }
    setPinCoords(coords);
    setMapCenter([coords.lat, coords.lng]);
    setMsg({ type:'', text:'' });
  };

  const handleMapClick = async (lat, lng) => {
    setMapCenter([lat, lng]); setPinCoords({ lat, lng });
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const d = await r.json();
      if (!venueName) setVenueName(d.display_name?.split(',')[0] || '');
    } catch {}
  };

  
  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setPinCoords({ lat, lng });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude, lng = pos.coords.longitude;
      setMapCenter([lat, lng]); setPinCoords({ lat, lng });
    
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const d = await r.json();
        if (d.display_name) setSearchText(d.display_name);
      } catch {}
    });
  };

  const toggleCuisine = (c) => setCuisines(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c]);

  const addGuest = () => {
    if (!guestInput.trim()) return;
    setGuestList(p => [...p, guestInput.trim().toUpperCase()]);
    setGuestInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token)                                    return setMsg({ type:'error', text:'❌ Please log in again.' });
    if (!venueName.trim())                         return setMsg({ type:'error', text:'❌ Venue name is required (e.g. VMK Mahal, Dindigul).' });
    if (!eventDate)                                return setMsg({ type:'error', text:'❌ Event date is required.' });
    if (!startTime)                                return setMsg({ type:'error', text:'❌ Start time is required.' });
    if (!pinCoords)                                return setMsg({ type:'error', text:'❌ Map pin is required. Click the map, search, or enter coordinates.' });
    if (!guestCount || Number(guestCount) < 1)     return setMsg({ type:'error', text:'❌ Guest count is required (minimum 1).' });
    if (!budget || Number(budget) < 1)             return setMsg({ type:'error', text:'❌ Budget is required.' });
    if (cuisines.length === 0)                     return setMsg({ type:'error', text:'❌ Select at least one food preference.' });

    
    const payload = {
      name:        venueName,
      event:       eventType,
      date:        eventDate,
      time:        startTime,
      endTime:     endTime,
      location:    venueName,
      coords:      { lat: pinCoords.lat, lng: pinCoords.lng },
      guests:      guestList,
      cuisines:    cuisines,
      guestCount:  Number(guestCount),
      specialNote: specialNotes,
      totalAmount: Number(budget),
      status:      'upcoming',
    };

    setLoading(true);
    try {
      const res = await axios.post('/api/add-event', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      const saved = res.data?.event;
      if (saved && (!saved.guestCount || !saved.totalAmount || !saved.cuisines?.length)) {
        console.warn('⚠️ Server saved incomplete event. Sent:', payload, 'Server returned:', saved);
      }

      setMsg({ type:'success', text:'✅ Booking saved successfully!' });
    
      setEventType('Wedding'); setEventDate(''); setStartTime(''); setEndTime('');
      setVenueName(''); setGuestCount(''); setBudget(''); setSpecialNotes('');
      setCuisines([]); setGuestList([]); setGuestInput('');
      setMapCenter([10.3868, 77.9679]); setPinCoords(null);
      setMapsLinkInput('');
      if (onSuccess) setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.message || 'Booking failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inp = { width:'100%', padding:'10px 12px', borderRadius:8, border:'1.5px solid #e0d6ff', outline:'none', fontSize:13, boxSizing:'border-box', fontFamily:'inherit' };
  const lbl = { display:'block', fontWeight:700, fontSize:12, color:'#7B2FBE', textTransform:'uppercase', letterSpacing:0.5, marginBottom:5 };
  const fld = { marginBottom:16 };

  return (
    <div style={{ padding:'10px', maxWidth:1000, margin:'0 auto', fontFamily:'sans-serif' }}>

      {msg.text && (
        <div style={{
          padding:'12px 16px', borderRadius:10, marginBottom:20, fontWeight:700, fontSize:14,
          background: msg.type==='success' ? '#e6f4ea' : '#fce8e6',
          color:      msg.type==='success' ? '#137333' : '#c5221f',
          border:     `1px solid ${msg.type==='success' ? '#ceead6' : '#fad2cf'}`,
        }}>{msg.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:30 }}>

          {/* ── LEFT COLUMN ── */}
          <div>
            <div style={fld}>
              <label style={lbl}>Event Type</label>
              <select value={eventType} onChange={e=>setEventType(e.target.value)} style={inp}>
                {["Wedding","Birthday","Corporate","Graduation","Reception","Custom Event"].map(t=>(
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={fld}>
              <label style={lbl}>📅 Event Date *</label>
              <input type="date" value={eventDate} required
                min={new Date().toISOString().split('T')[0]}
                onChange={e=>setEventDate(e.target.value)} style={inp} />
            </div>

            <div style={{ display:'flex', gap:12, marginBottom:16 }}>
              <div style={{ flex:1 }}>
                <label style={lbl}>🕐 Start Time *</label>
                <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} style={inp} />
              </div>
              <div style={{ flex:1 }}>
                <label style={lbl}>🕐 End Time</label>
                <input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} style={inp} />
              </div>
            </div>

            <div style={fld}>
              <label style={lbl}>👥 Guest Count * <span style={{color:'#c0392b'}}>(required)</span></label>
              <input type="number" min="1" placeholder="e.g. 150 — REQUIRED"
                value={guestCount} onChange={e=>setGuestCount(e.target.value)}
                style={{ ...inp, borderColor: (!guestCount || Number(guestCount)<1) ? '#FF6B6B' : '#e0d6ff' }} />
              {(!guestCount || Number(guestCount)<1) && (
                <p style={{ color:'#FF6B6B', fontSize:11, margin:'4px 0 0', fontWeight:600 }}>⚠ Enter number of guests</p>
              )}
            </div>

            <div style={fld}>
              <label style={lbl}>💰 Budget (₹) * <span style={{color:'#c0392b'}}>(required)</span></label>
              <input type="number" min="1" placeholder="e.g. 50000 — REQUIRED"
                value={budget} onChange={e=>setBudget(e.target.value)}
                style={{ ...inp, borderColor: (!budget || Number(budget)<1) ? '#FF6B6B' : '#e0d6ff' }} />
              {(!budget || Number(budget)<1) && (
                <p style={{ color:'#FF6B6B', fontSize:11, margin:'4px 0 0', fontWeight:600 }}>⚠ Enter estimated budget</p>
              )}
            </div>

            <div style={fld}>
              <label style={lbl}>Special Notes</label>
              <textarea rows="3" placeholder="Any special requests..." value={specialNotes}
                onChange={e=>setSpecialNotes(e.target.value)}
                style={{ ...inp, resize:'none', height:70 }} />
            </div>

            <div style={fld}>
              <label style={lbl}>🍽️ Food Preferences * <span style={{color:'#c0392b'}}>(select at least one)</span></label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {CUISINES.map(c => (
                  <button key={c} type="button" onClick={()=>toggleCuisine(c)} style={{
                    padding:'7px 14px', borderRadius:20, fontSize:12, fontWeight:600,
                    cursor:'pointer', border:'1.5px solid',
                    background:  cuisines.includes(c) ? 'linear-gradient(135deg,#7B2FBE,#2979FF)' : '#fff',
                    color:       cuisines.includes(c) ? '#fff' : '#666',
                    borderColor: cuisines.includes(c) ? 'transparent' : '#e0d6ff',
                  }}>
                    {cuisines.includes(c) ? '✓ ' : ''}{c}
                  </button>
                ))}
              </div>
              {cuisines.length === 0 && (
                <p style={{ color:'#FF6B6B', fontSize:11, margin:'6px 0 0', fontWeight:600 }}>⚠ Select at least one food preference</p>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div ref={dropRef}>
            <div style={fld}>
              <label style={lbl}>🏛️ Venue Name * <span style={{color:'#c0392b'}}>(required)</span></label>
              <input type="text" placeholder="e.g. VMK Mahal, Dindigul — REQUIRED"
                value={venueName} onChange={e=>setVenueName(e.target.value)}
                style={{ ...inp, borderColor: !venueName.trim() ? '#FF6B6B' : '#e0d6ff', fontWeight:700 }} />
              {!venueName.trim() && (
                <p style={{ color:'#FF6B6B', fontSize:11, margin:'4px 0 0', fontWeight:600 }}>⚠ Enter the venue name</p>
              )}
            </div>

            <div style={fld}>
              <label style={lbl}>📋 Paste Google Maps Link (recommended — finds any venue)</label>
              <div style={{ display:'flex', gap:8 }}>
                <input type="text" placeholder="Search venue on Google Maps, copy URL, paste here..."
                  value={mapsLinkInput} onChange={e=>setMapsLinkInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); applyMapsLink(); } }}
                  style={{ ...inp, flex:1 }} />
                <button type="button" onClick={applyMapsLink} style={{
                  padding:'8px 16px', background:'#7B2FBE', color:'#fff',
                  border:'none', borderRadius:8, fontWeight:700, fontSize:12,
                  cursor:'pointer', whiteSpace:'nowrap',
                }}>Use This</button>
              </div>
              <p style={{ color:'#888', fontSize:11, margin:'4px 0 0' }}>
                1. Search the venue on Google Maps &nbsp;→&nbsp; 2. Copy the page URL &nbsp;→&nbsp; 3. Paste it above.
                Works for any place, even ones missing from the map below.
              </p>
            </div>

            {/* PIN STATUS */}
            <div style={{
              background: pinCoords ? '#e6f9f4' : '#fff5f5',
              border: `1.5px solid ${pinCoords ? '#4ECDC4' : '#FF6B6B'}`,
              borderRadius:10, padding:'10px 14px', marginBottom:14,
            }}>
              {!pinCoords && (
                <p style={{ color:'#c0392b', fontSize:12, margin:0, fontWeight:700 }}>
                  ⚠ Paste a Google Maps link above (easiest), or click the map below, to drop the pin (required)
                </p>
              )}
              {pinCoords && (
                <p style={{ color:'#137333', fontSize:12, margin:0, fontWeight:700 }}>
                  ✅ Pin placed — drag it on the map to fine-tune the exact spot
                </p>
              )}
            </div>

            
            <div style={{ position:'relative', height:320, borderRadius:12, overflow:'hidden', marginBottom:10, border:'1px solid #dcd3ff' }}>
              <MapContainer center={mapCenter} zoom={15} style={{ height:'100%', width:'100%' }}>
                <MapViewUpdater center={mapCenter} />
                <MapClickHandler onMapClick={handleMapClick} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org">OpenStreetMap</a>' />
                {pinCoords && (
                  <Marker
                    position={[pinCoords.lat, pinCoords.lng]}
                    icon={customIcon}
                    draggable={true}
                    eventHandlers={{ dragend: handleDragEnd }}
                  >
                    <Popup>{venueName || 'Selected Venue'}</Popup>
                  </Marker>
                )}
              </MapContainer>
              {pinCoords && (
                <div style={{
                  position:'absolute', top:8, right:8, zIndex:1000,
                  background:'rgba(26,5,51,0.85)', color:'#fff',
                  padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:600,
                  pointerEvents:'none',
                }}>
                  👆 Drag pin to exact spot
                </div>
              )}
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
              <button type="button" onClick={useCurrentLocation} style={{
                padding:'8px 14px', background:'#fff', color:'#5c3bc4',
                border:'1.5px solid #5c3bc4', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer',
              }}>🎯 Use My Location</button>
              {pinCoords && (
                <a href={`https://www.google.com/maps?q=${pinCoords.lat},${pinCoords.lng}`}
                  target="_blank" rel="noreferrer"
                  style={{ fontSize:12, color:'#2979FF', fontWeight:700, alignSelf:'center' }}>
                  🔗 View on Google Maps
                </a>
              )}
              {pinCoords && (
                <span style={{ fontSize:12, color:'#5c3bc4', fontWeight:700, cursor:'pointer', alignSelf:'center' }}
                  onClick={()=>{
                    const link = `https://www.google.com/maps?q=${pinCoords.lat},${pinCoords.lng}`;
                    const txt = encodeURIComponent(`📍 ${venueName}\n🗺️ ${link}`);
                    navigator.clipboard.writeText(link);
                    window.open(`https://wa.me/?text=${txt}`, '_blank');
                  }}>
                  📢 Share with Guests
                </span>
              )}
            </div>

            {/* GUEST LIST */}
            <div style={fld}>
              <label style={lbl}>👥 Guest Names (optional)</label>
              <div style={{ display:'flex', gap:8 }}>
                <input type="text" placeholder="Guest name..." value={guestInput}
                  onChange={e=>setGuestInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'){e.preventDefault(); addGuest();} }}
                  style={{ ...inp, flex:1 }} />
                <button type="button" onClick={addGuest} style={{
                  padding:'10px 18px', background:'#7B2FBE', color:'#fff',
                  border:'none', borderRadius:8, fontWeight:700, cursor:'pointer',
                }}>Add</button>
              </div>
              {guestList.length > 0 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
                  {guestList.map((g,i) => (
                    <span key={i} style={{ background:'#f1ebff', color:'#7B2FBE', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:5 }}>
                      {g}
                      <span onClick={()=>setGuestList(p=>p.filter((_,idx)=>idx!==i))}
                        style={{ cursor:'pointer', color:'#FF6B6B', fontWeight:800 }}>✕</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} style={{
          marginTop:20, width:'100%', padding:16,
          background: loading ? '#aaa' : 'linear-gradient(135deg,#7B2FBE,#2979FF)',
          color:'#fff', border:'none', borderRadius:12,
          fontSize:16, fontWeight:'bold', cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow:'0 4px 15px rgba(123,47,190,0.25)',
        }}>
          {loading ? 'Saving...' : '🎉 Save Booking'}
        </button>
      </form>
    </div>
  );
}
