import { useState, useRef, useEffect } from "react";
import {
  CalendarDays, TrendingUp, Heart, Users, CreditCard, Calendar,
  Bell, Shield, Waves, MapPin, Sparkles, Zap, ChevronRight, ExternalLink
} from "lucide-react";
import App from "./App";
import config from "./demo.config.js";

const iconMap = { CalendarDays, TrendingUp, Heart, Users, CreditCard, Calendar, Bell, Shield, Waves, MapPin, Sparkles, Zap };
const getIcon = (name) => iconMap[name] || Shield;

export default function DemoWrapper() {
  const accent = config.accentColor;
  const accentLight = config.accentColorLight;
  const accentDark = config.accentColorDark;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f0f4f8", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── LEFT SIDEBAR ── */}
      <aside style={{
        width: 320, minWidth: 320, height: "100vh", overflowY: "auto",
        padding: "32px 28px", display: "flex", flexDirection: "column", gap: 20,
        borderRight: "1px solid #e2e8f0",
      }}
        className="demo-sidebar-left"
      >
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accent, marginBottom: 16 }}>Prototype Demo</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Outfit', serif", fontSize: 22, color: "#fff", fontWeight: 700,
            }}>
              {config.logoMark}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 26, fontWeight: 700, color: config.textDark, margin: 0, lineHeight: 1 }}>{config.studioName}</h1>
              <p style={{ fontSize: 13, color: config.textMuted, margin: 0 }}>{config.studioSubtitle}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {config.features.map((f, i) => {
            const Icon = getIcon(f.icon);
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <Icon size={18} color={accent} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: config.textDark, margin: 0 }}>{f.title}</p>
                  <p style={{ fontSize: 12, color: config.textMuted, margin: "2px 0 0", lineHeight: 1.4 }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Built by LUMI — LumiClass.app</p>
        </div>
      </aside>

      {/* ── CENTER — PHONE FRAME ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 0", minWidth: 0,
      }}>
        <div style={{
          width: 390, height: "min(92vh, 844px)",
          borderRadius: 32, overflow: "hidden",
          boxShadow: "0 25px 80px rgba(0,0,0,.12), 0 8px 24px rgba(0,0,0,.08)",
          border: "8px solid #1a1a1a",
          background: "#1a1a1a",
          position: "relative",
          transform: "translateZ(0)",
          display: "flex", flexDirection: "column",
        }}>
          {/* Notch */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 120, height: 28, background: "#1a1a1a",
            borderRadius: "0 0 16px 16px", zIndex: 100,
          }} />
          {/* App container */}
          <div style={{
            flex: 1, overflow: "hidden", borderRadius: 24,
            display: "flex", flexDirection: "column",
            position: "relative",
          }}>
            <App />
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <aside style={{
        width: 340, minWidth: 340, height: "100vh", overflowY: "auto",
        padding: "32px 28px", display: "flex", flexDirection: "column", gap: 16,
        borderLeft: "1px solid #e2e8f0",
      }}
        className="demo-sidebar-right"
      >
        {config.salesCards.map((card, i) => {
          const Icon = getIcon(card.icon);
          return (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, padding: "24px 22px",
              border: "1px solid #e2e8f0",
            }}>
              <Icon size={24} color={accent} style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: config.textDark, margin: "0 0 8px" }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: config.textMuted, margin: 0, lineHeight: 1.55 }}>{card.desc}</p>
            </div>
          );
        })}

        {/* CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${accent}, ${accentDark})`,
          borderRadius: 14, padding: "24px 22px", color: "#fff",
        }}>
          <h3 style={{ fontFamily: "'Outfit', serif", fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Ready to Launch?</h3>
          <p style={{ fontSize: 14, opacity: 0.85, margin: "0 0 16px", lineHeight: 1.5 }}>Get your own branded member loyalty app — built for your studio, your community, your growth.</p>
          <button style={{
            padding: "12px 24px", borderRadius: 8, border: "2px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, fontSize: 14,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            backdropFilter: "blur(4px)",
          }}>
            Get Started <ChevronRight size={16} />
          </button>
        </div>
      </aside>

      {/* Responsive: hide sidebars on narrow screens */}
      <style>{`
        .demo-sidebar-left, .demo-sidebar-right {
          scrollbar-width: none;
        }
        .demo-sidebar-left::-webkit-scrollbar, .demo-sidebar-right::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 1100px) {
          .demo-sidebar-left, .demo-sidebar-right { display: none !important; }
        }
      `}</style>
    </div>
  );
}
