import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search, Copy, Info,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Music, Gift, Share2, MapPin, Droplets, Waves, Zap, Timer
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  STUDIO_CONFIG -- ELU Yoga, Tacoma WA
// ═══════════════════════════════════════════════════════════════
const STUDIO_CONFIG = {
  name: "ELU",
  subtitle: "YOGA",
  tagline: "Find your flow. Join the movement.",
  logoMark: "E",
  logoImage: null,
  description: "Your sanctuary in downtown Tacoma -- a haven for balance, strength, and connection where everyone is celebrated. Elu means 'Living' in Estonian. Your third space for movement, breath, and real connection.",
  heroLine1: "YOGA.",
  heroLine2: "NO PRETENSE.",

  address: { street: "713 St Helens Ave, Suite 104", city: "Tacoma", state: "WA", zip: "98402" },
  phone: "(253) 555-0142",
  email: "hello@eluyoga.com",
  neighborhood: "Downtown Tacoma",
  website: "https://eluyoga.com",
  social: { instagram: "@eluyoga" },

  locations: [
    { id: "gt", name: "Golden Triangle", address: "1212 Delaware St", neighborhood: "Golden Triangle Creative District", city: "Tacoma" },
    { id: "ss", name: "Sunnyside", address: "4343 Fox St", neighborhood: "Historic Sunnyside", city: "Tacoma" },
    { id: "fp", name: "Five Points", address: "2500 Arapahoe St", neighborhood: "Five Points / RiNo", city: "Tacoma" },
  ],

  theme: {
    accent:     { h: 220, s: 50, l: 45 },   // River blue-teal
    accentAlt:  { h: 40, s: 55, l: 50 },    // Warm amber/gold
    warning:    { h: 5, s: 65, l: 50 },     // Terracotta
    primary:    { h: 225, s: 20, l: 11 },     // Deep blue-black
    surface:    { h: 220, s: 10, l: 98 },     // Cool white
    surfaceDim: { h: 220, s: 8, l: 95 },     // Cool off-white
  },

  features: {
    workshops: true,
    retreats: true,
    soundBaths: false,
    teacherTrainings: true,
    practiceTracking: true,
    communityFeed: true,
    guestPasses: true,
    milestones: true,
    multiLocation: true,
    yogaOnTheWaterfront: true,
  },

  classCapacity: 35,
  specialtyCapacity: 25,
};


// ═══════════════════════════════════════════════════════════════
//  STUDIO IMAGES — ELU Yoga CDN URLs
// ═══════════════════════════════════════════════════════════════
const ELU_CDN = "https://images.squarespace-cdn.com/content/v1/66e26ccf756604774e4c15fd";
const STUDIO_IMAGES = {
  hero: `${ELU_CDN}/f326d4ce-03f0-4d9d-80a4-e7427f659754/cairn+photo+unsplash.jpg?format=750w`,
  classesHero: `${ELU_CDN}/1726187271508-OOGJTBO9QGTJL3XBWZ8T/unsplash-image-eT-3XK9h5tU.jpg?format=500w`,
  teachersHero: `${ELU_CDN}/1726187304820-5NVTSPTXP5ACEKUGY6PJ/unsplash-image-UxkcSzRWM2s.jpg?format=500w`,
  studioShot: `${ELU_CDN}/068321e9-b7cf-4bed-8ce9-17d9e839eb1d/standing+edited.JPG?format=500w`,
  pricingHero: `${ELU_CDN}/1726187721231-4CIGNYFFG0WDTSC334E1/unsplash-image-nDnLMXYqOVs.jpg?format=500w`,
  logo: `${ELU_CDN}/fb618ff2-5f7f-4561-b668-6645abb51bf9/social+logo.jpg?format=300w`,
};

// ═══════════════════════════════════════════════════════════════
//  THEME SYSTEM
// ═══════════════════════════════════════════════════════════════
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -12),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 30),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.08),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.18),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#151c2a",
  textMuted: "#555e72",
  textFaint: "#858ea0",
  border: "#d8dde8",
  borderLight: "#e8ecf2",
};

// ═══════════════════════════════════════════════════════════════
//  DATE HELPERS
// ═══════════════════════════════════════════════════════════════
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const formatDateLong = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — ELU Yoga content
// ═══════════════════════════════════════════════════════════════
const TEACHERS = [
  { id: "t1", firstName: "Alex", lastName: "Simonian", role: "Teacher", certs: ["RYT-200", "Hot Yoga Certified"], specialties: ["Hot River Flow", "Vinyasa", "Sculpt"], yearsTeaching: 6, bio: "Alex brings a dynamic, playful energy to every class. With roots in dance and athletics, she creates sequences that challenge the body while calming the mind. Her classes are known for creative sequencing and uplifting playlists." },
  { id: "t2", firstName: "Amor", lastName: "Flores", role: "Teacher", certs: ["RYT-200", "CPR/AED"], specialties: ["Hot River Flow", "River Yin", "Meditation"], yearsTeaching: 4, bio: "Amor's teaching is rooted in accessibility and self-compassion. She believes yoga is for every body and creates a warm, inclusive atmosphere where students feel seen and supported." },
  { id: "t3", firstName: "Andy", lastName: "Jans", role: "Teacher", certs: ["E-RYT-500", "Yin Yoga Certified"], specialties: ["Deep Stretch", "River Yin", "Warm River Flow"], yearsTeaching: 10, bio: "Andy's practice is deeply influenced by mindfulness meditation and the healing power of stillness. His yin and restorative classes are beloved for their grounding, meditative quality." },
  { id: "t4", firstName: "Angelina", lastName: "Cilella", role: "Teacher", certs: ["RYT-200", "Pilates Certified"], specialties: ["Hot Pilates", "River Sculpt", "Hot River Flow"], yearsTeaching: 5, bio: "Angelina fuses the precision of Pilates with the fluidity of yoga, creating classes that are both empowering and intentional. She's passionate about core-centered movement and functional strength." },
  { id: "t5", firstName: "Danielle", lastName: "Cook", role: "Lead Teacher", certs: ["E-RYT-500", "Anusara", "Vinyasa"], specialties: ["Hot River Flow", "Candlelight Flow", "Teacher Training"], yearsTeaching: 14, bio: "Danielle grew up near Boulder and discovered yoga as a way to complement her active lifestyle. Her teaching style is nurturing, creative, and inspiring — she helps students open to experiences they never knew were possible." },
  { id: "t6", firstName: "Katy", lastName: "Rowe", role: "Studio Manager & Teacher", certs: ["RYT-200", "CPR/AED"], specialties: ["River Flow", "Deep Stretch", "Community Classes"], yearsTeaching: 7, bio: "Katy is the heart of ELU community. As studio manager and teacher, she ensures every student who walks through the door feels they belong. Her classes are grounding, accessible, and full of intention." },
  { id: "t7", firstName: "Xander", lastName: "Smith", role: "Pilates Lead", certs: ["Pilates Certified", "Mat Pilates Teacher Trainer"], specialties: ["Mat Pilates", "Hot Pilates", "Strength"], yearsTeaching: 8, bio: "Xander is the owner of HABITAT Pilates + Strength and leads ELU's Mat Pilates Teacher Training. His classes focus on building stronger connections within the body through core activation and intentional breath." },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Hot River Flow", type: "HOT FLOW",
  style: "Hot River Flow", temp: "95–100°F", duration: 60,
  description: "An invigorating flow that will strengthen your body, focus your mind, and empower your spirit. Dynamic sequencing with heat to deepen your practice.",
  intention: "Learn to go with the flow — find your edge, then breathe into it.",
  teacherTip: "Hydrate well before class. Take child's pose whenever you need it — listening to your body IS the practice.",
  playlist: "River Currents — Alex's Spotify",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "River Sculpt", type: "SCULPT", style: "Sculpt", temp: "Room Temp", duration: 50, description: "A dynamic full-body workout blending mindful yoga movement with strength training and cardio bursts. Hand weights, bodyweight exercises, and intentional movement.", intention: "Build muscle, build endurance, build yourself.", teacherTip: "Grab two sets of weights — lighter for arms, heavier for legs." },
  { id: "p-y2", date: offsetDate(-2), name: "Deep Stretch & Meditation", type: "RESTORE", style: "Deep Stretch", temp: "Room Temp", duration: 75, description: "Long holds, supported postures, and intentional stretches. Includes 15 minutes of guided seated meditation. A nervous system reset.", intention: "Surrender is not giving up — it's letting in.", teacherTip: "Grab two blocks and a bolster. Let gravity do the work." },
  { id: "p-y3", date: offsetDate(-3), name: "Candlelight River Flow", type: "CANDLELIGHT", style: "Candlelight", temp: "Warm", duration: 60, description: "Set to softer music and the glow of candles, this gentler vinyasa practice eases every muscle and helps your mind find peace.", intention: "In softness, we find our deepest strength." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "River Yin", type: "YIN", style: "Yin", temp: "Room Temp", duration: 75, description: "A slow-paced practice with long-held postures to lengthen tendons, smooth fascia, and increase performance. In a world of overstimulation, a yin practice leads to stillness.", intention: "In stillness, the river finds its depth.", teacherTip: "Bring an extra layer — your body cools during long holds." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:00", type: "Hot River Flow", coach: "Danielle Cook", location: "Golden Triangle", capacity: 35, registered: 31, waitlist: 0 },
  { id: "cl2", time: "07:15", type: "Hot Pilates", coach: "Angelina Cilella", location: "Golden Triangle", capacity: 30, registered: 30, waitlist: 2 },
  { id: "cl3", time: "09:00", type: "Warm River Flow", coach: "Katy Rowe", location: "Sunnyside", capacity: 35, registered: 24, waitlist: 0 },
  { id: "cl4", time: "09:30", type: "Hot River Flow", coach: "Alex Simonian", location: "Five Points", capacity: 35, registered: 33, waitlist: 0 },
  { id: "cl5", time: "12:00", type: "River Sculpt", coach: "Angelina Cilella", location: "Golden Triangle", capacity: 30, registered: 18, waitlist: 0 },
  { id: "cl6", time: "16:30", type: "Hot River Flow", coach: "Amor Flores", location: "Sunnyside", capacity: 35, registered: 30, waitlist: 0 },
  { id: "cl7", time: "17:45", type: "Mat Pilates", coach: "Xander Smith", location: "Five Points", capacity: 25, registered: 25, waitlist: 3 },
  { id: "cl8", time: "19:15", type: "Deep Stretch & Meditation", coach: "Andy Jans", location: "Golden Triangle", capacity: 30, registered: 22, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:00", type: "Hot River Flow", coach: "Danielle", loc: "GT" }, { time: "07:15", type: "Hot Pilates", coach: "Angelina", loc: "GT" }, { time: "09:00", type: "Warm River Flow", coach: "Katy", loc: "SS" }, { time: "09:30", type: "Hot River Flow", coach: "Alex", loc: "FP" }, { time: "12:00", type: "River Sculpt", coach: "Angelina", loc: "GT" }, { time: "16:30", type: "Hot River Flow", coach: "Amor", loc: "SS" }, { time: "17:45", type: "Mat Pilates", coach: "Xander", loc: "FP" }, { time: "19:15", type: "Deep Stretch", coach: "Andy", loc: "GT" }] },
  { day: "Tuesday", classes: [{ time: "06:00", type: "Hot River Flow", coach: "Alex", loc: "GT" }, { time: "07:30", type: "River Sculpt", coach: "Angelina", loc: "SS" }, { time: "09:30", type: "Hot River Flow", coach: "Danielle", loc: "FP" }, { time: "12:00", type: "River Flow", coach: "Katy", loc: "GT" }, { time: "16:30", type: "Hot Pilates", coach: "Xander", loc: "GT" }, { time: "17:45", type: "Hot River Flow", coach: "Amor", loc: "SS" }] },
  { day: "Wednesday", classes: [{ time: "06:00", type: "Hot Pilates", coach: "Angelina", loc: "GT" }, { time: "07:30", type: "Hot River Flow", coach: "Danielle", loc: "FP" }, { time: "09:00", type: "Warm River Flow", coach: "Alex", loc: "SS" }, { time: "12:00", type: "River Yin", coach: "Andy", loc: "GT" }, { time: "16:30", type: "Hot River Flow", coach: "Katy", loc: "SS" }, { time: "17:45", type: "River Sculpt", coach: "Angelina", loc: "GT" }, { time: "19:30", type: "Candlelight Flow", coach: "Amor", loc: "GT" }] },
  { day: "Thursday", classes: [{ time: "06:00", type: "Hot River Flow", coach: "Alex", loc: "GT" }, { time: "07:15", type: "Mat Pilates", coach: "Xander", loc: "FP" }, { time: "09:30", type: "Hot River Flow", coach: "Danielle", loc: "SS" }, { time: "12:00", type: "Warm River Flow", coach: "Katy", loc: "GT" }, { time: "16:30", type: "Hot Pilates", coach: "Angelina", loc: "GT" }, { time: "17:45", type: "Hot River Flow", coach: "Amor", loc: "FP" }, { time: "19:15", type: "Deep Stretch", coach: "Andy", loc: "GT" }] },
  { day: "Friday", classes: [{ time: "06:00", type: "Hot River Flow", coach: "Danielle", loc: "GT" }, { time: "07:30", type: "River Sculpt", coach: "Angelina", loc: "SS" }, { time: "09:30", type: "Hot River Flow", coach: "Alex", loc: "FP" }, { time: "12:00", type: "River Flow", coach: "Katy", loc: "GT" }, { time: "16:30", type: "Warm River Flow", coach: "Amor", loc: "SS" }, { time: "19:30", type: "Candlelight Flow", coach: "Andy", loc: "GT" }] },
  { day: "Saturday", classes: [{ time: "08:00", type: "Hot River Flow", coach: "Alex", loc: "GT" }, { time: "08:30", type: "Hot Pilates", coach: "Xander", loc: "FP" }, { time: "09:30", type: "Warm River Flow", coach: "Katy", loc: "SS" }, { time: "10:30", type: "River Sculpt", coach: "Angelina", loc: "GT" }, { time: "12:00", type: "River Yin", coach: "Andy", loc: "GT" }] },
  { day: "Sunday", classes: [{ time: "08:30", type: "Warm River Flow", coach: "Amor", loc: "SS" }, { time: "09:00", type: "Hot River Flow", coach: "Danielle", loc: "GT" }, { time: "10:30", type: "River Flow", coach: "Katy", loc: "FP" }, { time: "17:00", type: "Candlelight Flow", coach: "Andy", loc: "GT" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Sarah M.", milestone: "100 Classes", message: "100 classes at ELU. This community has become my family in Tacoma.", date: today, celebrations: 32 },
  { id: "cf2", user: "Marcus J.", milestone: "30-Day Streak", message: "30 days straight on the mat. ELU helped me find my flow in more ways than one.", date: today, celebrations: 21 },
  { id: "cf3", user: "Elena R.", milestone: "All 3 Studios!", message: "Finally practiced at all three locations! Sunnyside's open-air garage door studio is magic.", date: offsetDate(-1), celebrations: 38 },
  { id: "cf4", user: "Dev P.", milestone: "1 Year Member", message: "One year as a River member. From my first intro class to now — what a journey.", date: offsetDate(-1), celebrations: 45 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Droplets, color: T.accent },
  "10 Classes": { icon: Waves, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent },
  "100 Classes": { icon: Sun, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "All 3 Studios": { icon: MapPin, color: "#8b5cf6" },
  "First Inversion": { icon: ArrowUpRight, color: "#3b82f6" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "Yoga on the Waterfront", date: "2026-06-14", startTime: "07:00", type: "Signature Event", description: "Practice yoga along the Tacoma waterfront at Ruston Way. An unforgettable morning of movement with Mt. Rainier and the Puget Sound as your backdrop.", fee: 35, maxParticipants: 200, registered: 168, status: "Registration Open" },
  { id: "ev2", name: "100hr Mat Pilates Teacher Training", date: "2026-04-03", startTime: "09:00", type: "Teacher Training", description: "Led by Xander Smith of HABITAT Pilates + Strength. A comprehensive 7-week training covering Mat Pilates fundamentals, anatomy, cueing, and sequencing.", fee: 2200, maxParticipants: 20, registered: 14, status: "Registration Open" },
  { id: "ev3", name: "Summer Solstice Flow + Celebration", date: "2026-06-20", startTime: "18:00", type: "Special Event", description: "Celebrate the longest day of the year with an outdoor sunset flow at Sunnyside's open-air studio followed by community gathering and refreshments from local partners.", fee: 25, maxParticipants: 50, registered: 33, status: "Registration Open" },
  { id: "ev4", name: "Candlelight Yin + Sound Journey", date: offsetDate(5), startTime: "19:30", type: "Workshop", description: "A deep restorative yin practice by candlelight accompanied by crystal singing bowls and ambient soundscapes. The perfect Friday evening reset.", fee: 30, maxParticipants: 30, registered: 24, status: "Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m1", name: "Intro Offer", type: "intro", price: 59, period: "14 days", features: ["14 days unlimited movement", "All classes, all locations", "Yoga, Pilates, Sculpt & more", "First time students only"], popular: false },
  { id: "m2", name: "Single Class", type: "drop-in", price: 30, period: "per class", features: ["1 class at any location", "Valid for 30 days", "All class types"], popular: false },
  { id: "m3", name: "10 Class Card", type: "pack", price: 250, period: "10 classes", features: ["10 class credits", "Valid for 6 months", "Use at any location", "Share with a friend"], popular: false },
  { id: "m4", name: "Rise Unlimited", type: "unlimited", price: 159, period: "/month", annualPrice: 1749, features: ["Unlimited classes at all 3 studios", "Priority booking window", "15% off workshops & events", "2 guest passes per month", "Access to online stream library", "Cancel anytime — no commitment"], popular: true },
  { id: "m5", name: "Stream Online", type: "online", price: 29, period: "/month", features: ["Unlimited livestream classes", "Full on-demand video library", "Practice anywhere, anytime", "Your favorite River teachers"], popular: false },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "Yoga on the Waterfront is back!", message: "Tickets for our signature waterfront sessions are live. These sell out fast -- secure your spot for an unforgettable sunrise practice.", type: "celebration", pinned: true },
  { id: "a2", title: "Sunnyside Open-Air Studio", message: "The garage door is rolling up for the season! Catch warm breezes and sunshine during your practice at Sunnyside.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Sarah Martinez", email: "sarah@email.com", membership: "Rise Unlimited", status: "active", joined: "2023-03-15", checkIns: 312, lastVisit: today, homeStudio: "Golden Triangle" },
  { id: "mem2", name: "Marcus Johnson", email: "marcus@email.com", membership: "Rise Unlimited", status: "active", joined: "2022-09-01", checkIns: 445, lastVisit: offsetDate(-1), homeStudio: "Sunnyside" },
  { id: "mem3", name: "Elena Ruiz", email: "elena@email.com", membership: "10 Class Card", status: "active", joined: "2025-11-01", checkIns: 32, lastVisit: offsetDate(-2), homeStudio: "Five Points" },
  { id: "mem4", name: "Dev Patel", email: "dev@email.com", membership: "Rise Unlimited", status: "active", joined: "2025-03-24", checkIns: 178, lastVisit: today, homeStudio: "Golden Triangle" },
  { id: "mem5", name: "Mia Chen", email: "mia@email.com", membership: "Rise Unlimited", status: "frozen", joined: "2024-06-01", checkIns: 112, lastVisit: offsetDate(-30), homeStudio: "Five Points" },
  { id: "mem6", name: "Jason Bell", email: "jason@email.com", membership: "Stream Online", status: "active", joined: "2026-01-10", checkIns: 8, lastVisit: offsetDate(-3), homeStudio: "Online" },
  { id: "mem7", name: "Taylor Brooks", email: "taylor@email.com", membership: "Rise Unlimited", status: "active", joined: "2023-07-01", checkIns: 267, lastVisit: today, homeStudio: "Sunnyside" },
  { id: "mem8", name: "Priya Nair", email: "priya@email.com", membership: "Rise Unlimited (Annual)", status: "active", joined: "2024-01-10", checkIns: 398, lastVisit: offsetDate(-1), homeStudio: "Golden Triangle" },
];

const ADMIN_METRICS = {
  activeMembers: 342, memberChange: 18,
  todayCheckIns: 124, weekCheckIns: 782,
  monthlyRevenue: 52400, revenueChange: 11.2,
  renewalRate: 93.1, workshopRevenue: 8600,
};

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 128, avg: 16 }, { day: "Tue", total: 112, avg: 19 },
    { day: "Wed", total: 118, avg: 17 }, { day: "Thu", total: 130, avg: 19 },
    { day: "Fri", total: 104, avg: 17 }, { day: "Sat", total: 95, avg: 19 },
    { day: "Sun", total: 72, avg: 18 },
  ],
  revenue: [
    { month: "Oct", revenue: 44200 }, { month: "Nov", revenue: 46800 },
    { month: "Dec", revenue: 43100 }, { month: "Jan", revenue: 48900 },
    { month: "Feb", revenue: 50100 }, { month: "Mar", revenue: 52400 },
  ],
  membershipBreakdown: [
    { name: "Rise Unlimited", value: 198, color: T.accent },
    { name: "Class Cards", value: 68, color: T.success },
    { name: "Intro Offers", value: 42, color: T.warning },
    { name: "Stream Online", value: 34, color: "#8b5cf6" },
  ],
  locationBreakdown: [
    { name: "Golden Triangle", value: 45, color: T.accent },
    { name: "Sunnyside", value: 30, color: T.success },
    { name: "Five Points", value: 25, color: T.warning },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext();

function PageTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20, paddingTop: 16 }}>
      <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 32, fontWeight: 600, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: "'Outfit', serif", fontSize: 22, fontWeight: 600, color: T.text, margin: 0 }}>{title}</h2>
      {linkText && <button onClick={() => setPage(linkPage)} style={{ fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>{linkText} <ChevronRight size={14} /></button>}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: T.bgDim, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Outfit', serif", fontSize: 22, fontWeight: 700, color: T.text }}>{value}</div>
      <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "32px 16px", color: T.textFaint }}>
      <Icon size={28} />
      <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{message}</p>
      {sub && <p style={{ fontSize: 12, margin: 0 }}>{sub}</p>}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline }) {
  const shared = { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, background: T.bgDim, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {multiline ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...shared, resize: "vertical" }} /> : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={shared} />}
    </div>
  );
}

function CTACard() {
  return (
    <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(0,0%,12%))`, borderRadius: 16, padding: "28px 22px", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `${T.accent}20` }} />
      <div style={{ position: "absolute", bottom: -20, right: 40, width: 80, height: 80, borderRadius: "50%", background: `${T.accent}10` }} />
      <Waves size={24} color={T.accent} style={{ marginBottom: 10 }} />
      <h3 style={{ fontFamily: "'Outfit', serif", fontSize: 24, margin: "0 0 6px", fontWeight: 600 }}>Jump Into ELU</h3>
      <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.5 }}>14 days of unlimited movement across all three Tacoma studios. Your journey starts here.</p>
      <button style={{ padding: "12px 28px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Outfit', serif", fontSize: 17, letterSpacing: "0.02em" }}>Start Your Intro — $59</button>
    </div>
  );
}

function LocationBadge({ loc }) {
  const colors = { GT: T.accent, SS: T.success, FP: T.warning };
  const names = { GT: "GT", SS: "SS", FP: "FP" };
  return (
    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${colors[loc] || T.accent}18`, color: colors[loc] || T.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>{names[loc] || loc}</span>
  );
}

function PracticeCardFull({ practice, expanded, onToggle }) {
  const isToday = practice.date === today;
  const isFuture = practice.date > today;
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${isToday ? T.accent : T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }} onClick={onToggle}>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: isToday ? T.accent : isFuture ? T.success : T.textFaint }}>{isToday ? "Today's Focus" : isFuture ? "Coming Up" : formatDateShort(practice.date)}</span>
            <h3 style={{ fontFamily: "'Outfit', serif", fontSize: 22, margin: "4px 0 0", fontWeight: 600, color: T.text }}>{practice.name}</h3>
          </div>
          <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", marginTop: 8 }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{practice.style}</span>
          {practice.temp && <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{practice.temp}</span>}
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{practice.duration} min</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
          <p style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.6, margin: "0 0 14px" }}>{practice.description}</p>
          {practice.intention && (
            <div style={{ padding: "12px 14px", borderRadius: 10, background: T.accentGhost, border: `1px solid ${T.accentBorder}`, marginBottom: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, margin: "0 0 4px" }}>Intention</p>
              <p style={{ fontSize: 13, color: T.text, fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>{practice.intention}</p>
            </div>
          )}
          {practice.teacherTip && (
            <div style={{ padding: "12px 14px", borderRadius: 10, background: T.successGhost, border: `1px solid ${T.successBorder}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.success, margin: "0 0 4px" }}>Teacher Tip</p>
              <p style={{ fontSize: 13, color: T.text, margin: 0, lineHeight: 1.5 }}>{practice.teacherTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AdminCard({ title, children }) {
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: 18 }}>
      <h3 style={{ fontFamily: "'Outfit', serif", fontSize: 18, color: "#e2e8f0", margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

// ——— MODALS ———
function SettingsModal({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", maxWidth: 390, width: "100%", maxHeight: "80vh", overflow: "auto", padding: "20px 16px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Outfit', serif", fontSize: 24, margin: 0 }}>Settings</h2>
          <button onClick={onClose} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={T.textMuted} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {["My Profile", "Home Studio", "Notification Preferences", "Linked Accounts", "Help & Support", "Terms & Privacy"].map(item => (
            <button key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", fontSize: 14, color: T.text, fontWeight: 500 }}>
              {item}<ChevronRight size={16} color={T.textFaint} />
            </button>
          ))}
        </div>
        <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 12, background: T.bgDim, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: T.textMuted, margin: "0 0 2px" }}>{STUDIO_CONFIG.name} {STUDIO_CONFIG.subtitle}</p>
          <p style={{ fontSize: 11, color: T.textFaint, margin: 0 }}>{STUDIO_CONFIG.phone} · {STUDIO_CONFIG.email}</p>
        </div>
      </div>
    </div>
  );
}

function NotificationsModal({ onClose }) {
  const notifs = [
    { id: "n1", title: "Class Reminder", msg: "Hot River Flow with Alex starts in 1 hour at Golden Triangle", time: "1h ago", read: false },
    { id: "n2", title: "Milestone Unlocked!", msg: "You've hit 50 classes at ELU!", time: "Yesterday", read: false },
    { id: "n3", title: "New Event", msg: "Yoga on the Waterfront tickets are now available", time: "2 days ago", read: true },
    { id: "n4", title: "Community Love", msg: "3 people celebrated your 50-class milestone", time: "3 days ago", read: true },
  ];
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", maxWidth: 390, width: "100%", maxHeight: "80vh", overflow: "auto", padding: "20px 16px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Outfit', serif", fontSize: 24, margin: 0 }}>Notifications</h2>
          <button onClick={onClose} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={T.textMuted} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifs.map(n => (
            <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, background: n.read ? "transparent" : T.accentGhost, border: `1px solid ${n.read ? T.border : T.accentBorder}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "transparent" : T.accent, flexShrink: 0, marginTop: 6 }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{n.title}</p>
                <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0", lineHeight: 1.4 }}>{n.msg}</p>
                <p style={{ fontSize: 11, color: T.textFaint, margin: "4px 0 0" }}>{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const spotsLeft = classData.capacity - classData.registered;
  const isFull = spotsLeft <= 0;
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: 16, maxWidth: 360, width: "100%", padding: "24px 20px", boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>
        {confirmed ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={28} color={T.accent} />
            </div>
            <h3 style={{ fontFamily: "'Outfit', serif", fontSize: 24, margin: "0 0 6px" }}>You're In!</h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 20px" }}>See you on the mat for {classData.type}</p>
            <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 15, fontFamily: "'Outfit', serif" }}>Done</button>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: "'Outfit', serif", fontSize: 24, margin: "0 0 16px" }}>Reserve Your Spot</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: T.textMuted }}>Class</span>
                <span style={{ fontWeight: 600, color: T.text }}>{classData.type}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: T.textMuted }}>Teacher</span>
                <span style={{ fontWeight: 600, color: T.text }}>{classData.coach}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: T.textMuted }}>Time</span>
                <span style={{ fontWeight: 600, color: T.text }}>{classData.dayLabel || "Today"} · {fmtTime(classData.time)}</span>
              </div>
              {classData.location && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: T.textMuted }}>Location</span>
                  <span style={{ fontWeight: 600, color: T.text }}>{classData.location}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: T.textMuted }}>Availability</span>
                <span style={{ fontWeight: 600, color: isFull ? T.warning : T.accent }}>{isFull ? `Waitlist (${classData.waitlist} ahead)` : `${spotsLeft} spots left`}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", fontSize: 15, fontWeight: 600, cursor: "pointer", color: T.textMuted }}>Cancel</button>
              <button onClick={() => { onConfirm(classData.id); setConfirmed(true); }} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 15, fontFamily: "'Outfit', serif" }}>{isFull ? "Join Waitlist" : "Confirm"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONSUMER PAGES
// ═══════════════════════════════════════════════════════════════

// ——— HOME PAGE ———
function HomePage() {
  const { setPage, classRegistrations, openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const nextClass = CLASSES_TODAY.find(c => !classRegistrations.includes(c.id));
  const upcomingClasses = CLASSES_TODAY.filter(c => {
    const [h] = c.time.split(":"); return +h >= new Date().getHours();
  }).slice(0, 3);

  return (
    <div>
      {/* Hero with image */}
      <div style={{ position: "relative", overflow: "hidden", padding: "36px 16px 28px", color: "#fff", minHeight: 220 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${STUDIO_IMAGES.hero})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.45) 100%)" }} />
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: T.accent, margin: "0 0 8px", position: "relative", zIndex: 1 }}>{formatDateLong(today)}</p>
        <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 44, margin: 0, lineHeight: 1, fontWeight: 300, letterSpacing: "-0.02em", position: "relative", zIndex: 1 }}>{STUDIO_CONFIG.heroLine1}</h1>
        <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 44, margin: "0 0 10px", lineHeight: 1, fontWeight: 700, letterSpacing: "-0.02em", position: "relative", zIndex: 1 }}>{STUDIO_CONFIG.heroLine2}</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.5, position: "relative", zIndex: 1 }}>{STUDIO_CONFIG.description}</p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px 0", justifyContent: "center" }}>
        {[
          { icon: CalendarDays, label: "Reserve", page: "schedule" },
          { icon: TrendingUp, label: "Practice", page: "practice" },
          { icon: Heart, label: "Community", page: "community" },
          { icon: Users, label: "Teachers", page: "teachers" },
        ].map(action => (
          <button key={action.label} onClick={() => setPage(action.page)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            padding: "14px 16px", borderRadius: 12, border: `1px solid ${T.border}`,
            background: T.bgCard, cursor: "pointer", minWidth: 76,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <action.icon size={22} color={T.accent} />
            <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Today's Focus */}
      <section style={{ padding: "20px 16px 0" }}>
        <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
        <PracticeCardFull practice={TODAYS_FOCUS} expanded={true} onToggle={() => {}} />
      </section>

      {/* Upcoming Classes */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <SectionHeader title="Today's Schedule" linkText="Full Schedule" linkPage="schedule" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcomingClasses.length > 0 ? upcomingClasses.map(cls => {
            const isRegistered = classRegistrations.includes(cls.id);
            const isFull = cls.registered >= cls.capacity;
            return (
              <div key={cls.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", background: T.bgCard, border: `1px solid ${isRegistered ? T.accent : T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 52 }}>
                  <span style={{ fontFamily: "'Outfit', serif", fontSize: 17, color: T.text, fontWeight: 700 }}>{fmtTime(cls.time)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>
                    <LocationBadge loc={cls.location === "Golden Triangle" ? "GT" : cls.location === "Sunnyside" ? "SS" : "FP"} />
                  </div>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{cls.coach}</p>
                </div>
                {isRegistered ? (
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.accent, display: "flex", alignItems: "center", gap: 4 }}><Check size={14} /> Reserved</span>
                ) : (
                  <button onClick={() => openReservation(cls)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: isFull ? T.warningGhost : T.accent, color: isFull ? T.warning : "#fff" }}>
                    {isFull ? "Waitlist" : "Reserve"}
                  </button>
                )}
              </div>
            );
          }) : (
            <EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />
          )}
        </div>
      </section>

      {/* Community Feed */}
      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Community" linkText="View All" linkPage="community" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                      {item.user} <span style={{ color: T.success }}>{item.milestone}</span>
                    </p>
                    <p style={{ fontSize: 12, color: "#5a6775", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.message.length > 60 ? item.message.slice(0, 60) + "…" : item.message}
                    </p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                    <Heart size={18} color={T.success} fill={myC > 0 ? T.success : "none"} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Announcements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : a.type === "alert" ? T.warning : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : a.type === "alert" ? T.warningGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "#5a6775", margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <CTACard />
      </section>
    </div>
  );
}

// ——— CLASSES PAGE ———
function ClassesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const allPractices = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Classes" subtitle="Past, present, and upcoming practice" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allPractices.map(p => (
          <PracticeCardFull key={p.id} practice={p} expanded={expandedPractice === p.id} onToggle={() => setExpandedPractice(expandedPractice === p.id ? null : p.id)} />
        ))}
      </div>
    </div>
  );
}

// ——— SCHEDULE PAGE ———
function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [locationFilter, setLocationFilter] = useState("all");
  const { classRegistrations, openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const filteredClasses = WEEKLY_SCHEDULE[selectedDay]?.classes.filter(cls =>
    locationFilter === "all" || cls.loc === locationFilter
  ) || [];

  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Schedule" subtitle="Reserve your spot — classes fill up fast" />
      {/* Day selector */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
        {days.map((d, i) => (
          <button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selectedDay === i ? T.accent : T.bgDim, color: selectedDay === i ? "#fff" : T.textMuted, transition: "all 0.15s" }}>
            {d}
          </button>
        ))}
      </div>
      {/* Location filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[{ id: "all", label: "All Locations" }, { id: "GT", label: "Golden Tri" }, { id: "SS", label: "Sunnyside" }, { id: "FP", label: "Five Points" }].map(loc => (
          <button key={loc.id} onClick={() => setLocationFilter(loc.id)} style={{ padding: "6px 10px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", background: locationFilter === loc.id ? T.accentGhost : "transparent", color: locationFilter === loc.id ? T.accent : T.textFaint }}>
            {loc.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filteredClasses.map((cls, i) => {
          const isSpecial = cls.type.includes("Yin") || cls.type.includes("Candlelight") || cls.type.includes("Deep");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
              <div style={{ textAlign: "center", minWidth: 56 }}>
                <span style={{ fontFamily: "'Outfit', serif", fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtTime(cls.time)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>
                  <LocationBadge loc={cls.loc} />
                  {isSpecial && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Special</span>}
                </div>
                {cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}
              </div>
              <button onClick={() => openReservation({ id: `sched-${selectedDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", location: cls.loc === "GT" ? "Golden Triangle" : cls.loc === "SS" ? "Sunnyside" : "Five Points", capacity: isSpecial ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: Math.floor(Math.random() * 10) + 15, waitlist: 0, dayLabel: dayNames[selectedDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>
                Reserve
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— PRACTICE TRACKING PAGE ———
function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);
  const handleSave = () => { setSaved("log"); setTimeout(() => setSaved(null), 2000); setReflection({ energy: 4, focus: 4, notes: "" }); };
  const streakDays = 14;
  const totalClasses = 112;

  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="My Practice" subtitle="Track your journey and celebrate growth" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Flame size={20} color={T.accent} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Outfit', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{streakDays}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Day Streak</div>
        </div>
        <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Star size={20} color={T.success} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Outfit', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{totalClasses}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Classes</div>
        </div>
        <div style={{ background: T.warningGhost, border: `1px solid ${T.warningBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <MapPin size={20} color={T.warning} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Outfit', serif", fontSize: 28, fontWeight: 700, color: T.text }}>3</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Studios</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
        {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "log" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Droplets size={18} color={T.accent} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Energy Level</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, energy: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.energy >= n ? T.accent : T.border}`, background: reflection.energy >= n ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Moon size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : n <= 4 ? <Sun size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : <Sparkles size={18} color={reflection.energy >= n ? T.accent : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Focus & Presence</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, focus: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.focus >= n ? T.success : T.border}`, background: reflection.focus >= n ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Wind size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : n <= 4 ? <Heart size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : <Sparkles size={18} color={reflection.focus >= n ? T.success : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What came up for you on the mat today?" multiline />
            <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Outfit', serif", letterSpacing: "0.03em", fontSize: 17 }}>
              {saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}
            </button>
          </div>
        </div>
      )}
      {activeTab === "milestones" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(MILESTONE_BADGES).map(([name, badge]) => {
            const earned = ["First Class", "10 Classes", "50 Classes", "100 Classes", "7-Day Streak", "30-Day Streak", "All 3 Studios"].includes(name);
            return (
              <div key={name} style={{ background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? badge.color + "30" : T.border}`, borderRadius: 12, padding: "16px 14px", textAlign: "center", opacity: earned ? 1 : 0.5 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: earned ? badge.color + "18" : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                  <badge.icon size={22} color={earned ? badge.color : T.textFaint} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: earned ? T.text : T.textFaint, margin: "0 0 2px" }}>{name}</p>
                <p style={{ fontSize: 11, color: earned ? T.accent : T.textFaint, fontWeight: 600, margin: 0 }}>{earned ? "Earned" : "Locked"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ——— COMMUNITY PAGE ———
function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Community" subtitle="Celebrate your River fam" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COMMUNITY_FEED.map(item => {
          const myC = feedCelebrations[item.id] || 0;
          return (
            <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                  {item.user[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{formatDateShort(item.date)}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.successGhost, color: T.success }}>{item.milestone}</span>
              </div>
              <p style={{ fontSize: 14, color: "#3d4a5c", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
              <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.successBorder : T.border}`, background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer" }}>
                <Heart size={16} color={T.success} fill={myC > 0 ? T.success : "none"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— TEACHERS PAGE ———
function TeachersPage() {
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Teachers" subtitle="Meet ELU teaching team" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TEACHERS.map(teacher => {
          const expanded = expandedTeacher === teacher.id;
          return (
            <div key={teacher.id} onClick={() => setExpandedTeacher(expanded ? null : teacher.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', serif", fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>{teacher.firstName} {teacher.lastName}</h3>
                  <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{teacher.yearsTeaching} years teaching</p>
                </div>
                <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {expanded && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.6, margin: "0 0 12px" }}>{teacher.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {teacher.specialties.map(s => (<span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {teacher.certs.map(c => (<span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— MEMBERSHIP PAGE ———
function MembershipPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Membership" subtitle="Find your path to practice" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            {tier.popular && (
              <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Popular</div>
            )}
            <h3 style={{ fontFamily: "'Outfit', serif", fontSize: 22, margin: "0 0 4px", color: T.text }}>{tier.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Outfit', serif", fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            {tier.annualPrice && (
              <p style={{ fontSize: 12, color: T.success, fontWeight: 600, marginBottom: 12 }}>Annual: ${tier.annualPrice}/yr (save ${tier.price * 12 - tier.annualPrice})</p>
            )}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#4a5568" }}>
                  <CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />{f}
                </li>
              ))}
            </ul>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', serif", letterSpacing: "0.03em", background: tier.popular ? T.accent : T.bg, color: "#fff" }}>Get Started</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ——— EVENTS PAGE ———
function EventsPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Events" subtitle="Workshops, trainings, and signature experiences" />
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(0,0%,12%))`, padding: "20px 18px", color: "#fff" }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent }}>{ev.type}</span>
            <h3 style={{ fontFamily: "'Outfit', serif", fontSize: 22, margin: "6px 0 4px", fontWeight: 600 }}>{ev.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#94a3b8" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDateShort(ev.date)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatBox label="Price" value={`$${ev.fee}`} />
              <StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} />
            </div>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', serif", letterSpacing: "0.03em", background: T.accent, color: "#fff" }}>Register Now</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ——— LOCATIONS PAGE ———
function LocationsPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Our Studios" subtitle="Three neighborhoods, one River" />
      {STUDIO_CONFIG.locations.map(loc => (
        <div key={loc.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 18px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MapPin size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Outfit', serif", fontSize: 22, margin: 0, fontWeight: 600, color: T.text }}>{loc.name}</h3>
              <p style={{ fontSize: 13, color: T.textMuted, margin: "2px 0 0" }}>{loc.neighborhood}</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#4a5568", margin: "0 0 12px" }}>{loc.address}, {loc.city || "Tacoma"}, WA</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Hot River Flow", "Sculpt", "Pilates", "Yin"].map(c => (
              <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{c}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES
// ═══════════════════════════════════════════════════════════════
function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, positive: true, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns} this week`, positive: true, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, positive: true, icon: DollarSign, color: T.warning },
    { label: "Workshop Revenue", value: `$${ADMIN_METRICS.workshopRevenue.toLocaleString()}`, change: "+24 registrations", positive: true, icon: Award, color: "#8b5cf6" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 28, color: "#fff", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>Welcome back. Here's what's happening across all three studios.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <m.icon size={18} color={m.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'Outfit', serif", fontSize: 30, color: "#fff", fontWeight: 700 }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: m.positive ? "#4ade80" : "#f87171" }}>
                {m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {m.change}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "6px 0 0" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <AdminCard title="Weekly Attendance (All Locations)">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Revenue Trend">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHARTS.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <AdminCard title="Membership Breakdown">
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard title="Attendance by Location">
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ADMIN_CHARTS.locationBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {ADMIN_CHARTS.locationBreakdown.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {ADMIN_CHARTS.locationBreakdown.map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = MEMBERS_DATA.filter(m => (filter === "all" || m.status === filter) && (m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 28, color: "#fff", margin: 0 }}>Members</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><UserPlus size={16} /> Add Member</button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "active", "frozen"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? T.accent : "#1a1a1a", color: filter === f ? "#fff" : "#9ca3af" }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
              {["Member", "Membership", "Studio", "Status", "Classes", "Last Visit"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #2a2a2a" }}>
                <td style={{ padding: "12px 16px" }}>
                  <p style={{ color: "#fff", fontWeight: 600, margin: 0 }}>{m.name}</p>
                  <p style={{ color: "#6b7280", fontSize: 12, margin: "2px 0 0" }}>{m.email}</p>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{m.membership}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>{m.homeStudio}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "capitalize", background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning }}>{m.status}</span>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontFamily: "monospace" }}>{m.checkIns}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>{formatDateShort(m.lastVisit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 28, color: "#fff", margin: 0 }}>Schedule Management</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Class</button>
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
              {["Time", "Class", "Teacher", "Location", "Capacity", "Status", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES_TODAY.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #2a2a2a" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontFamily: "monospace" }}>{fmtTime(c.time)}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontWeight: 600 }}>{c.type}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{c.coach}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{c.location}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.registered >= c.capacity ? `${T.warning}20` : `${T.accent}20`, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered >= c.capacity ? "Full" : "Open"}</span>
                </td>
                <td style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
                  <button style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: "transparent", color: T.accent, fontSize: 11, cursor: "pointer" }}>Edit</button>
                  <button style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: "transparent", color: T.warning, fontSize: 11, cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTeachersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 28, color: "#fff", margin: 0 }}>Teachers</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><UserPlus size={16} /> Add Teacher</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {TEACHERS.map(teacher => (
          <div key={teacher.id} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', serif", fontSize: 20, color: "#fff", fontWeight: 600 }}>{teacher.firstName[0]}{teacher.lastName[0]}</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{teacher.firstName} {teacher.lastName}</h3>
                <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {teacher.certs.map(c => (<span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#2a2a2a", color: "#9ca3af" }}>{c}</span>))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #2a2a2a", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #2a2a2a", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEventsPage() {
  const [search, setSearch] = useState("");
  const filtered = EVENTS.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 28, color: "#fff", margin: 0 }}>Events</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Event</button>
      </div>
      <div style={{ position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…" style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
              {["Event", "Date", "Type", "Registered", "Max", "Status", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} style={{ borderBottom: "1px solid #2a2a2a" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600 }}>{e.name}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{formatDateShort(e.date)}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>{e.type}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{e.registered}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{e.maxParticipants}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${T.accent}20`, color: T.accent }}>{e.status}</span>
                </td>
                <td style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
                  <button style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: "transparent", color: T.accent, fontSize: 11, cursor: "pointer" }}>Edit</button>
                  <button style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: "transparent", color: T.warning, fontSize: 11, cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPricingPage() {
  const [search, setSearch] = useState("");
  const filtered = MEMBERSHIP_TIERS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 28, color: "#fff", margin: 0 }}>Pricing & Membership Tiers</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Tier</button>
      </div>
      <div style={{ position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tiers…" style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
              {["Tier", "Price", "Period", "Popular", "Features", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #2a2a2a" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600 }}>{m.name}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>${m.price}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>{m.period}</td>
                <td style={{ padding: "12px 16px", color: m.popular ? T.success : "#9ca3af" }}>{m.popular ? "Yes" : "No"}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 11 }}>{m.features.length} features</td>
                <td style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
                  <button style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: "transparent", color: T.accent, fontSize: 11, cursor: "pointer" }}>Edit</button>
                  <button style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: "transparent", color: T.warning, fontSize: 11, cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCommsPage() {
  const [msg, setMsg] = useState({ title: "", body: "", audience: "all" });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 28, color: "#fff", margin: 0 }}>Broadcast</h1>
      <AdminCard title="Send Announcement">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Audience</label>
            <div style={{ display: "flex", gap: 4 }}>
              {["all", "unlimited", "class-card", "intro"].map(a => (
                <button key={a} onClick={() => setMsg({ ...msg, audience: a })} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: msg.audience === a ? T.accent : "#2a2a2a", color: msg.audience === a ? "#fff" : "#9ca3af" }}>{a === "all" ? "All Members" : a}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Title</label>
            <input value={msg.title} onChange={e => setMsg({ ...msg, title: e.target.value })} placeholder="Announcement title…" style={{ width: "100%", padding: "10px 12px", background: "#0f1724", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Message</label>
            <textarea value={msg.body} onChange={e => setMsg({ ...msg, body: e.target.value })} placeholder="Write your message…" rows={4} style={{ width: "100%", padding: "10px 12px", background: "#0f1724", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }} />
          </div>
          <button style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }}><Send size={14} /> Send Announcement</button>
        </div>
      </AdminCard>
    </div>
  );
}

function AdminSettingsPage() {
  const [settings, setSettings] = useState({ studioName: "ELU Yoga", timeZone: "America/Los_Angeles", theme: "dark" });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Outfit', serif", fontSize: 28, color: "#fff", margin: 0 }}>Settings</h1>
      <AdminCard title="Studio Settings">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Studio Name</label>
            <input value={settings.studioName} onChange={e => setSettings({ ...settings, studioName: e.target.value })} style={{ width: "100%", padding: "10px 12px", background: "#0f1724", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Time Zone</label>
            <input value={settings.timeZone} onChange={e => setSettings({ ...settings, timeZone: e.target.value })} style={{ width: "100%", padding: "10px 12px", background: "#0f1724", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Theme</label>
            <div style={{ display: "flex", gap: 4 }}>
              {["dark", "light"].map(t => (
                <button key={t} onClick={() => setSettings({ ...settings, theme: t })} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: settings.theme === t ? T.accent : "#2a2a2a", color: settings.theme === t ? "#fff" : "#9ca3af" }}>{t}</button>
              ))}
            </div>
          </div>
          <button style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, alignSelf: "flex-start" }}>Save Settings</button>
        </div>
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App({ onAdminChange, forceAdmin }) {
  const [page, setPage] = useState(forceAdmin ? "admin-dashboard" : "home");
  const [isAdmin, setIsAdmin] = useState(!!forceAdmin);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [classRegistrations, setClassRegistrations] = useState([]);
  const [reservationClass, setReservationClass] = useState(null);
  const [feedCelebrations, setFeedCelebrations] = useState({});
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    if (onAdminChange) onAdminChange(isAdmin);
  }, [isAdmin, onAdminChange]);

  const handleLogoClick = () => {
    if (page !== "home") setPage("home");
  };

  const registerForClass = (classId) => setClassRegistrations(prev => [...prev, classId]);
  const openReservation = (classData) => setReservationClass(classData);
  const celebrateFeed = (feedId) => setFeedCelebrations(prev => ({ ...prev, [feedId]: (prev[feedId] || 0) + 1 }));
  const unreadCount = 2;

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "practice", label: "Practice", icon: TrendingUp },
    { id: "more", label: "More", icon: Menu },
  ];

  const moreItems = [
    { id: "classes", label: "Classes", icon: Waves },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "events", label: "Events", icon: Calendar },
    { id: "community", label: "Community", icon: Heart },
    { id: "membership", label: "Membership", icon: CreditCard },
    { id: "locations", label: "Studios", icon: MapPin },
  ];

  const isMoreActive = moreItems.some(item => item.id === page);

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-schedule", label: "Schedule", icon: CalendarDays },
    { id: "admin-teachers", label: "Teachers", icon: UserCheck },
    { id: "admin-members", label: "Members", icon: Users },
    { id: "admin-events", label: "Events", icon: Calendar },
    { id: "admin-pricing", label: "Pricing", icon: CreditCard },
    { id: "admin-comms", label: "Broadcast", icon: Megaphone },
    { id: "admin-settings", label: "Settings", icon: Settings },
  ];

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "events": return <EventsPage />;
      case "membership": return <MembershipPage />;
      case "locations": return <LocationsPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-comms": return <AdminCommsPage />;
      case "admin-settings": return <AdminSettingsPage />;
      default: return <HomePage />;
    }
  };

  // ADMIN LAYOUT
  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <div style={{ display: "flex", minHeight: "100vh", background: "#0d1520", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#e2e8f0" }}>
          <aside style={{ width: 240, background: "#111827", borderRight: "1px solid #2a2a2a", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 10 }}>
            <div style={{ padding: "16px 14px", borderBottom: "1px solid #2a2a2a", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', serif", fontSize: 18, color: "#fff", fontWeight: 700 }}>E</div>
              <div>
                <span style={{ fontFamily: "'Outfit', serif", fontSize: 18, color: "#fff", fontWeight: 600, display: "block", lineHeight: 1 }}>ELU</span>
                <span style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin Panel</span>
              </div>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
              {adminTabs.map(tab => {
                const active = page === tab.id;
                return (
                  <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#a1a1aa", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
                  </button>
                );
              })}
            </nav>
            <div style={{ borderTop: "1px solid #2a2a2a", padding: "10px 8px" }}>
              <button onClick={() => { setIsAdmin(false); setPage("home"); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#a1a1aa", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                <LogOut size={18} /><span>Exit Admin</span>
              </button>
            </div>
          </aside>
          <main style={{ flex: 1, marginLeft: 240, padding: 24, overflow: "auto" }}>{renderPage()}</main>
        </div>
      </AppContext.Provider>
    );
  }

  // CONSUMER LAYOUT
  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative" }}>
        {/* Header */}
        <header style={{ position: "sticky", top: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={handleLogoClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>E</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "'Outfit', serif", fontSize: 20, lineHeight: 1, letterSpacing: "0.02em", fontWeight: 600 }}>ELU</span>
              <span style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>YOGA</span>
            </div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={() => { setIsAdmin(true); setPage("admin-dashboard"); }} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}><Shield size={20} /></button>
            <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}>
              <Bell size={20} />
              {unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}
            </button>
            <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}><Settings size={20} /></button>
          </div>
        </header>

        {/* Content */}
        <main ref={contentRef} style={{ flex: 1, overflowY: "auto", paddingBottom: 12 }}>{renderPage()}</main>

        {/* More Menu */}
        {showMore && (
          <div onClick={() => setShowMore(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 56, left: 16, right: 16, maxWidth: 358, margin: "0 auto", background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
                <span style={{ fontFamily: "'Outfit', serif", fontSize: 20, fontWeight: 600 }}>More</span>
                <button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {moreItems.map(item => {
                  const active = page === item.id;
                  return (
                    <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}>
                      <item.icon size={22} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <nav style={{ flexShrink: 0, zIndex: 30, background: T.bgCard, borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 4px 10px" }}>
            {mainTabs.map(tab => {
              const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
              if (tab.id === "more") {
                return (
                  <button key={tab.id} onClick={() => setShowMore(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                    <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                    <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                  </button>
                );
              }
              return (
                <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                  <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Modals */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
      </div>
    </AppContext.Provider>
  );
}
