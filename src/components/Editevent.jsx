import React, { useState } from "react";



export default function EditEventModal({ booking, onCancel, onSave }) {
  const [form, setForm] = useState({
    name:        booking.name || "",
    date:        booking.date ? booking.date.slice(0, 10) : "",
    time:        booking.time || "",
    endTime:     booking.endTime || "",
    guestCount:  booking.guestCount ?? "",
    totalAmount: booking.totalAmount ?? "",
    specialNote: booking.specialNote || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(booking._id, {
        ...form,
        guestCount:  Number(form.guestCount)  || 0,
        totalAmount: Number(form.totalAmount) || 0,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onCancel}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={s.title}>Edit Booking</h3>

        <label style={s.lbl}>Venue Name</label>
        <input style={s.inp} value={form.name} onChange={set("name")} />

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={s.lbl}>Date</label>
            <input type="date" style={s.inp} value={form.date} onChange={set("date")} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.lbl}>Start</label>
            <input type="time" style={s.inp} value={form.time} onChange={set("time")} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.lbl}>End</label>
            <input type="time" style={s.inp} value={form.endTime} onChange={set("endTime")} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={s.lbl}>Guests</label>
            <input type="number" min="1" style={s.inp} value={form.guestCount} onChange={set("guestCount")} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.lbl}>Budget (₹)</label>
            <input type="number" min="0" style={s.inp} value={form.totalAmount} onChange={set("totalAmount")} />
          </div>
        </div>

        <label style={s.lbl}>Special Notes</label>
        <textarea style={{ ...s.inp, resize: "none", height: 60 }}
          value={form.specialNote} onChange={set("specialNote")} />

        <p style={s.hint}>📍 Venue location isn't editable here — use "New Booking" for full location control.</p>

        <div style={s.actionRow}>
          <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "💾 Save"}
          </button>
          <button style={s.cancelBtn} onClick={onCancel} disabled={saving}>✕ Cancel</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  modal: {
    background: "#fff", borderRadius: 16, padding: "24px 26px", width: 420,
    maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
  },
  title: { fontSize: 18, fontWeight: 800, color: "#1a0050", margin: "0 0 16px" },
  lbl: { display: "block", fontSize: 11, fontWeight: 700, color: "#7B2FBE",
    textTransform: "uppercase", letterSpacing: 0.4, margin: "10px 0 4px" },
  inp: { width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1.5px solid #e0d6ff", outline: "none", fontSize: 13.5,
    boxSizing: "border-box", fontFamily: "inherit" },
  hint: { fontSize: 11, color: "#aaa", margin: "10px 0 0", fontStyle: "italic" },
  actionRow: { display: "flex", gap: 10, marginTop: 20 },
  saveBtn: { flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #4ECDC4",
    background: "#4ECDC415", color: "#1a8f85", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  cancelBtn: { flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #999",
    background: "#99999915", color: "#666", fontSize: 13, fontWeight: 700, cursor: "pointer" },
};