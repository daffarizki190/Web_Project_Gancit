/**
 * ═══════════════════════════════════════════════════════════════════════
 *  Gandaria City Project Hub
 *  PT. Centrepark Citra Corpora | Portal Operasional v1.0.0
 *  Stack: React 19 + Vite · Tailwind CSS v4 · Framer Motion · Lucide React
 * ═══════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, type FC, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BookOpen,
  Car,
  FileText,
  Clock,
  Shield,
  Building2,
  Menu,
  X,
  ExternalLink,
  ArrowRight,
  Globe,
  MapPin,
  TrendingUp,
  Star,
  Cpu,
  ShoppingBag,
  UtensilsCrossed,
  Film,
  ParkingCircle,
  Zap,
  HeartHandshake,
  Award,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

import iconAura from "./assets/icons/3d/aura.png";
import iconPahamAja from "./assets/icons/3d/pahamaja.png";
import iconParkMate from "./assets/icons/3d/parkmate.png";
import iconReport from "./assets/icons/3d/report.png";
import hero3d from "./assets/icons/3d/hero_clean.png";

/* ─────────────────────────────────────────────────────────────────────
   MOTION PRESETS
───────────────────────────────────────────────────────────────────── */
const ease = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease },
});

const fadeUpView = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay, ease },
});

const stagger = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true },
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  },
};

const staggerChild = {
  variants: {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  },
};

/* ─────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────── */
interface Project {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: keyof typeof ICON_MAP;
  threedIcon: string;
  accent: string;
  accentBg: string;
  url: string;
  tag: string;
  version: string;
  stat: string;
}

interface GcStat {
  value: string;
  suffix: string;
  label: string;
}
interface GcFacility {
  icon: LucideIcon;
  accent: string;
  label: string;
  desc: string;
}
interface GcFact {
  k: string;
  v: string;
}
interface CpStat {
  value: string;
  suffix: string;
  label: string;
}
interface CpService {
  icon: LucideIcon;
  accent: string;
  accentBg: string;
  title: string;
  desc: string;
}
interface Timeline {
  year: string;
  title: string;
  desc: string;
}
interface NavLink {
  href: string;
  label: string;
}

/* ─────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────── */
const ICON_MAP = { Activity, BookOpen, Car, FileText } as const;

const PROJECTS: Project[] = [
  {
    id: "aura",
    title: "A.U.R.A",
    subtitle: "Asset Update & Report Application",
    desc: "Platform terpusat manajemen aset, laporan kondisi, dan tracking pemeliharaan fasilitas Gandaria City secara real-time.",
    icon: "Activity",
    threedIcon: iconAura,
    accent: "#2563eb",
    accentBg: "#eff6ff",
    url: "https://a-u-r-a.vercel.app/",
    tag: "Asset Management",
    version: "v2.4.1",
    stat: "1.284 Aset",
  },
  {
    id: "pahamaja",
    title: "PahamAja",
    subtitle: "LMS & Quiz Dashboard",
    desc: "Sistem manajemen pembelajaran dan evaluasi kuis interaktif untuk pengembangan kompetensi personil operasional.",
    icon: "BookOpen",
    threedIcon: iconPahamAja,
    accent: "#7c3aed",
    accentBg: "#f5f3ff",
    url: "https://paham-aja-dashboard-quiz.vercel.app/",
    tag: "Learning & Dev",
    version: "v1.8.0",
    stat: "36 Modul",
  },
  {
    id: "parkmate",
    title: "ParkMate Gancit",
    subtitle: "Monitoring Gerbang Parkir Otomatis",
    desc: "Dashboard monitoring real-time kapasitas parkir, status gerbang, dan analitik arus kendaraan di seluruh zona.",
    icon: "Car",
    threedIcon: iconParkMate,
    accent: "#059669",
    accentBg: "#ecfdf5",
    url: "https://parking-gandaria-city.vercel.app/",
    tag: "Parking Operations",
    version: "v3.1.2",
    stat: "847 Slot",
  },
  {
    id: "reportspv",
    title: "Report SPV",
    subtitle: "Sistem Pelaporan Harian",
    desc: "Pelaporan operasional harian terintegrasi — insiden, serah terima shift, dan ringkasan performa per zona.",
    icon: "FileText",
    threedIcon: iconReport,
    accent: "#d97706",
    accentBg: "#fffbeb",
    url: "https://report-spv.vercel.app/",
    tag: "Reporting",
    version: "v1.2.5",
    stat: "218 Laporan",
  },
];

const GC_STATS: GcStat[] = [
  { value: "100", suffix: "K m²", label: "Leaseable Area" },
  { value: "18", suffix: "", label: "Anchor Tenants" },
  { value: "400", suffix: "+", label: "Specialty Shops" },
  { value: "7", suffix: " Lt", label: "Lantai" },
];

const GC_FACILITIES: GcFacility[] = [
  {
    icon: ShoppingBag,
    accent: "#2563eb",
    label: "Fashion & Retail",
    desc: "H&M, Uniqlo, Mango, M&S, Levi's dan 400+ tenant fashion & lifestyle",
  },
  {
    icon: UtensilsCrossed,
    accent: "#d97706",
    label: "Main Street 600m",
    desc: "Lorong kuliner ikonik bertema Old Batavia & New York Times Square",
  },
  {
    icon: Film,
    accent: "#7c3aed",
    label: "Cinema XXI IMAX",
    desc: "Layar IMAX terbesar di Jakarta Selatan, audio-visual premium",
  },
  {
    icon: Star,
    accent: "#b45309",
    label: "The Art Mall",
    desc: "Instalasi seni kontemporer & venue konser internasional",
  },
  {
    icon: Building2,
    accent: "#0891b2",
    label: "Superblock Terpadu",
    desc: "Gandaria 8 Office Tower, Gandaria Heights & Sheraton Grand Jakarta",
  },
  {
    icon: ParkingCircle,
    accent: "#059669",
    label: "Parkir Digital",
    desc: "Sistem parkir real-time dikelola PT. Centrepark Citra Corpora",
  },
];

const GC_FACTS: GcFact[] = [
  { k: "Pengelola", v: "Pakuwon Jati" },
  { k: "Arsitek", v: "Cadiz International" },
  { k: "Dibuka", v: "5 Agustus 2010" },
  { k: "Luas NLA", v: "100.118 m²" },
  { k: "Parkir", v: "PT. Centrepark Citra Corpora" },
  {
    k: "Alamat",
    v: "Jl. Sultan Iskandar Muda No. 8, Kebayoran Lama, Jakarta Selatan 12240",
  },
];

const CP_STATS: CpStat[] = [
  { value: "2009", suffix: "", label: "Tahun Berdiri" },
  { value: "700", suffix: "+", label: "Lokasi" },
  { value: "165", suffix: "+", label: "Karyawan" },
  { value: "16", suffix: " Th", label: "Pengalaman" },
];

const CP_SERVICES: CpService[] = [
  {
    icon: ParkingCircle,
    accent: "#2563eb",
    accentBg: "#eff6ff",
    title: "Parking Management",
    desc: "Pengelolaan parkir profesional untuk mall, gedung perkantoran, rumah sakit, dan area publik di seluruh Indonesia.",
  },
  {
    icon: Cpu,
    accent: "#0891b2",
    accentBg: "#ecfeff",
    title: "Smart Technology",
    desc: "AI, IoT, TITO, RFID, real-time occupancy monitoring, dan dashboard analitik berbasis data.",
  },
  {
    icon: Zap,
    accent: "#d97706",
    accentBg: "#fffbeb",
    title: "Cashless Payment",
    desc: "Integrasi kartu nirsentuh, e-wallet, dan QR code untuk pengalaman parkir tanpa hambatan.",
  },
  {
    icon: TrendingUp,
    accent: "#059669",
    accentBg: "#ecfdf5",
    title: "Revenue Optimization",
    desc: "Pendekatan data-driven untuk mengoptimalkan pendapatan mitra dan efisiensi operasional.",
  },
  {
    icon: HeartHandshake,
    accent: "#7c3aed",
    accentBg: "#f5f3ff",
    title: "Layanan Fleksibel",
    desc: "Solusi disesuaikan kebutuhan unik setiap lokasi — dari skala kecil hingga mixed-use besar.",
  },
  {
    icon: Award,
    accent: "#b45309",
    accentBg: "#fef3c7",
    title: "Human Touch",
    desc: "Tim bersertifikat yang mengedepankan standar pelayanan, keamanan, dan kenyamanan pengguna.",
  },
];

const CP_TIMELINE: Timeline[] = [
  {
    year: "2009",
    title: "Pendirian",
    desc: "Berdiri 1 November 2009 di Jakarta sebagai perusahaan jasa parkir profesional.",
  },
  {
    year: "2012",
    title: "Ekspansi Nasional",
    desc: "Merambah kota-kota besar: Surabaya, Bandung, Medan, Makassar, dan Bali.",
  },
  {
    year: "2019",
    title: "Transformasi Digital",
    desc: "Rollout TITO, RFID, dan real-time monitoring di ratusan lokasi sekaligus.",
  },
  {
    year: "2021",
    title: "Cashless Era",
    desc: "Akselerasi pembayaran digital pasca pandemi — 80% lokasi cashless.",
  },
  {
    year: "2025",
    title: "Smart Mobility",
    desc: "700+ lokasi aktif. Integrasi AI & IoT menuju Smart Mobility Parking Solution.",
  },
];

const NAV_LINKS: NavLink[] = [
  { href: "#projects", label: "Aplikasi" },
  { href: "#about-gandaria", label: "Gandaria City" },
  { href: "#about-centrepark", label: "Centrepark" },
];

/* ─────────────────────────────────────────────────────────────────────
   HOOK — Real-Time Clock
───────────────────────────────────────────────────────────────────── */
function useClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(
        n.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
      setDate(
        n.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, []);
  return { time, date };
}

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT — Animated Counter
───────────────────────────────────────────────────────────────────── */
interface CounterProps {
  target: string;
  suffix?: string;
  duration?: number;
}

const Counter: FC<CounterProps> = ({ target, suffix = "", duration = 1.4 }) => {
  const [display, setDisplay] = useState("0");
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!on) return;
    const parsed = parseInt(String(target).replace(/\D/g, ""), 10);
    if (isNaN(parsed)) {
      setDisplay(target);
      return;
    }
    const frames = Math.round(duration * 60);
    let f = 0;
    const t = setInterval(() => {
      f++;
      const e = 1 - Math.pow(1 - f / frames, 3);
      setDisplay(Math.round(e * parsed).toLocaleString("id-ID"));
      if (f >= frames) {
        clearInterval(t);
        setDisplay(parsed.toLocaleString("id-ID"));
      }
    }, 1_000 / 60);
    return () => clearInterval(t);
  }, [on, target, duration]);

  return (
    <motion.span onViewportEnter={() => setOn(true)} viewport={{ once: true }}>
      {display}
      {suffix}
    </motion.span>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT — Section Wrapper
───────────────────────────────────────────────────────────────────── */
interface SectionProps {
  id?: string;
  children: ReactNode;
  alt?: boolean;
  className?: string;
}
const Section: FC<SectionProps> = ({ id, children, alt, className = "" }) => (
  <section
    id={id}
    className={`relative py-32 ${alt ? "bg-gray-50/20" : ""} ${className}`}
  >
    <div className="max-w-[1440px] mx-auto px-20 md:px-48 relative z-10">
      {children}
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT — Section Header
───────────────────────────────────────────────────────────────────── */
interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  sub?: string;
  delay?: number;
}
const SectionHeader: FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  sub,
  delay = 0,
}) => (
  <motion.div {...fadeUpView(delay)} className="mb-14 lg:mb-20">
    <p className="label-caps mb-4">{eyebrow}</p>
    <h2
      className="max-w-4xl"
      style={{
        fontSize: "clamp(2.5rem, 6vw, 4rem)",
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 800,
        letterSpacing: "-0.03em",
        color: "#1a1a1a",
        lineHeight: 1,
      }}
    >
      {title}
    </h2>
    {sub && (
      <p
        className="mt-6 max-w-xl leading-relaxed"
        style={{ color: "#6b6b6b", fontSize: "16px" }}
      >
        {sub}
      </p>
    )}
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT — Navbar
───────────────────────────────────────────────────────────────────── */
interface NavbarProps {
  time: string;
  date: string;
}

const Navbar: FC<NavbarProps> = ({ time, date }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 24, x: "-50%", opacity: 1 }}
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[92%] max-w-[1200px] ${
        scrolled ? "nav-glass py-2 px-6 rounded-full" : "bg-transparent py-4 px-8"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-20 md:px-48 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#2563eb" }}
          >
            <Building2 size={14} color="white" />
          </div>
          <div className="leading-tight">
            <p
              className="text-base font-extrabold tracking-tighter"
              style={{
                fontFamily: '"Outfit", sans-serif',
                color: "#0f172a",
                lineHeight: 1,
              }}
            >
              CENTREPARK
            </p>
            <p className="font-semibold" style={{ fontSize: "10px", color: "#2563eb", letterSpacing: '0.1em', marginTop: '1px', textTransform: 'uppercase' }}>
              Project Hub
            </p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm transition-colors duration-150"
              style={{ color: "#6b6b6b" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b6b")}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Clock + Mobile toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p
              className="font-mono text-sm font-semibold"
              style={{ color: "#1a1a1a", letterSpacing: "0.04em" }}
            >
              <Clock
                size={11}
                className="inline mr-1"
                style={{ color: "#8a8a8a" }}
              />
              {time}
            </p>
            <p style={{ fontSize: "10px", color: "#8a8a8a" }}>{date}</p>
          </div>
          <button
            className="md:hidden p-1 transition-colors"
            style={{ color: "#6b6b6b" }}
            onClick={() => setOpen((p) => !p)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{
              borderTop: "1px solid rgba(0,0,0,0.07)",
              background: "#f8f7f4",
            }}
          >
            <div className="px-5 md:px-10 py-4 space-y-4">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block text-sm"
                  style={{ color: "#4b4b4b" }}
                >
                  {label}
                </a>
              ))}
              <div
                className="pt-3"
                style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
              >
                <p
                  className="font-mono text-sm font-semibold"
                  style={{ color: "#1a1a1a" }}
                >
                  {time}
                </p>
                <p style={{ fontSize: "11px", color: "#8a8a8a" }}>{date}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT — Hero
───────────────────────────────────────────────────────────────────── */
const Hero: FC = () => (
  <section
    className="min-h-[100svh] flex items-center relative overflow-hidden pt-32 pb-16 lg:py-0"
  >
    {/* Animated background auras */}
    <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-100/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
    <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-purple-100/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4" />

    <div className="max-w-[1440px] mx-auto px-20 md:px-48 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        {/* Left: Text Content */}
        <div className="lg:col-span-7 min-w-0">
          {/* Eyebrow */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-10">
             <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
               Enterprise Platform
             </div>
             <div className="h-px w-8 bg-blue-200" />
            <p className="label-caps !mb-0">
              PT. Centrepark Citra Corpora
            </p>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            {...fadeUp(0.07)}
            className="text-6xl sm:text-7xl lg:text-[6rem] xl:text-[7.2rem] font-extrabold leading-[1] tracking-tight text-[#0f172a] break-words mb-8"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Gandaria City <br />
            <span className="text-[#2563eb]">Project Hub</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.14)}
            className="max-w-xl text-lg md:text-xl text-[#64748b] leading-relaxed break-words"
          >
            Platform manajemen operasional terpadu Gandaria City. Akses seluruh aplikasi internal dalam satu antarmuka modern yang efisien.
          </motion.p>

          {/* CTA */}
          <motion.div
            {...fadeUp(0.2)}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            <a href="#projects" className="btn-premium px-10 py-5 text-lg !bg-[#2563eb] hover:!bg-[#1e40af] shadow-lg shadow-blue-500/20">
              Mulai Eksplorasi <ArrowRight size={22} />
            </a>
             <a href="#about-centrepark" className="btn-premium-outline !bg-white !text-[#0f172a] border-gray-200 hover:border-blue-200">
              Tentang Kami
            </a>
          </motion.div>
        </div>

        {/* Right: Graphic */}
        <motion.div
          {...fadeUp(0.3)}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="relative group">
            <motion.div 
               animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
               transition={{ duration: 10, repeat: Infinity }}
               className="absolute -inset-10 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 blur-[80px] rounded-full opacity-60" 
            />
            <img
              src={hero3d}
              alt="3D Illustration"
              className="w-[90%] max-w-[500px] lg:w-full lg:max-w-[700px] h-auto object-contain relative z-10 drop-shadow-2xl"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT — Project Card
───────────────────────────────────────────────────────────────────── */
interface ProjectCardProps {
  project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-10 h-full flex flex-col group overflow-hidden relative cursor-pointer !bg-white border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onClick={() => window.open(project.url, "_blank", "noopener,noreferrer")}
    >
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ 
          background: `radial-gradient(500px circle at 50% 0%, ${project.accent}08, transparent 70%)` 
        }}
      />

      {/* Top Section */}
      <div className="flex items-start justify-between mb-10 z-10">
         <motion.div
          animate={{ 
            y: hov ? -8 : 0,
            scale: hov ? 1.05 : 1
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${project.accent}10, ${project.accent}05)`,
            border: `1px solid ${project.accent}15`,
          }}
        >
          <img 
            src={project.threedIcon} 
            alt={project.title} 
            className="w-[60%] h-[60%] object-contain relative z-10 drop-shadow-lg"
          />
        </motion.div>

        {/* Status */}
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
          <span className="dot-live" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563eb]">Aktif</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 z-10">
        <p
          className="font-extrabold tracking-tight text-[#0f172a] mb-2"
          style={{
            fontSize: "2rem",
            fontFamily: '"Outfit", sans-serif',
            lineHeight: 1
          }}
        >
          {project.title}
        </p>

        <p className="font-bold uppercase tracking-[0.15em] mb-5" style={{ fontSize: "10px", color: project.accent }}>
          {project.subtitle}
        </p>

        <p
          className="text-[#64748b] leading-relaxed line-clamp-3"
          style={{ fontSize: "15px" }}
        >
          {project.desc}
        </p>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-50 z-10">
        <div>
          <p className="text-[14px] font-bold text-[#0f172a]">{project.stat}</p>
          <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mt-1">{project.tag}</p>
        </div>
        <motion.div 
          animate={{ x: hov ? 4 : 0 }}
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all"
        >
           <ExternalLink size={18} className="text-[#0f172a] group-hover:text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT — Projects Section
───────────────────────────────────────────────────────────────────── */
const Projects: FC = () => (
  <Section id="projects" alt>
    <SectionHeader
      eyebrow="Portal Aplikasi"
      title="Sistem Operasional"
      sub="Klik kartu untuk membuka aplikasi. Login dilakukan di masing-masing platform."
    />
    <motion.div
      {...stagger}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto"
    >
      {PROJECTS.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </motion.div>
    <motion.p
      {...fadeUpView(0.2)}
      className="mt-12 flex items-center gap-1.5"
      style={{ fontSize: "11px", color: "#b8b8b8" }}
    >
      <Shield size={11} />
      Seluruh aktivitas tercatat di masing-masing platform untuk keperluan
      audit.
    </motion.p>
  </Section>
);

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT — About Gandaria City
───────────────────────────────────────────────────────────────────── */
const AboutGandaria: FC = () => {
  const [tab, setTab] = useState(0);
  const TABS = ["Profil", "Fasilitas", "Info Lokasi"];

  const tabContent: ReactNode[] = [
    /* ── Profil ── */
    <div
      key="profil"
      className="space-y-3"
      style={{ fontSize: "13px", color: "#4b4b4b", lineHeight: 1.8 }}
    >
      <p>
        Dibuka <strong style={{ color: "#1a1a1a" }}>5 Agustus 2010</strong> dan
        dikelola oleh <strong style={{ color: "#1a1a1a" }}>Pakuwon Jati</strong>
        . Gandaria City atau{" "}
        <strong style={{ color: "#1a1a1a" }}>"Gancit"</strong> adalah mal ritel
        terbesar di Jakarta Selatan dengan luas area netto 100.118 m².
      </p>
      <p>
        Dirancang oleh{" "}
        <strong style={{ color: "#1a1a1a" }}>Cadiz International</strong> —
        firma arsitek dengan portofolio di Dubai, Manila, China, dan USA. Gancit
        memadukan arsitektur modern dengan konsep one-stop lifestyle
        destination.
      </p>
      <p>
        Terintegrasi dengan{" "}
        <strong style={{ color: "#1a1a1a" }}>Gandaria 8 Office Tower</strong>,{" "}
        <strong style={{ color: "#1a1a1a" }}>
          Gandaria Heights Condominium
        </strong>
        , dan{" "}
        <strong style={{ color: "#1a1a1a" }}>Sheraton Grand Jakarta</strong> —
        ekosistem tinggal, bekerja, dan berbelanja terlengkap di Jakarta
        Selatan.
      </p>
    </div>,

    /* ── Fasilitas ── */
    <div key="fasilitas" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {GC_FACILITIES.map(({ icon: Icon, accent, label, desc }) => (
        <motion.div
          key={label}
          whileHover={{ x: 3 }}
          transition={{ duration: 0.15 }}
          className="flex items-start gap-3 p-3.5 rounded-xl"
          style={{
            background: "#f8f7f4",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${accent}18` }}
          >
            <Icon size={14} style={{ color: accent }} />
          </div>
          <div>
            <p
              className="font-semibold mb-0.5"
              style={{ fontSize: "12px", color: "#1a1a1a" }}
            >
              {label}
            </p>
            <p style={{ fontSize: "11px", color: "#6b6b6b", lineHeight: 1.55 }}>
              {desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>,

    /* ── Info Lokasi ── */
    <div key="info" className="space-y-0">
      {GC_FACTS.map(({ k, v }) => (
        <div
          key={k}
          className="flex gap-6 py-3 accordion-item"
          style={{ fontSize: "13px" }}
        >
          <span className="shrink-0 w-20" style={{ color: "#8a8a8a" }}>
            {k}
          </span>
          <span style={{ color: "#1a1a1a" }}>{v}</span>
        </div>
      ))}
    </div>,
  ];

  return (
    <Section id="about-gandaria">
      <SectionHeader
        eyebrow="Kebayoran Lama · Jakarta Selatan"
        title="Gandaria City"
        sub="Mal ritel terbesar di Jakarta Selatan — superblock premium sejak 2010."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* LEFT — stats + tabs */}
        <div className="lg:col-span-3 space-y-12">
          {/* Stats */}
          <motion.div {...fadeUpView(0.05)} className="grid grid-cols-4 gap-6">
            {GC_STATS.map(({ value, suffix, label }) => (
              <div
                key={label}
                className="text-center py-4 rounded-xl"
                style={{
                  background: "#f1f0ed",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <p className="stat-num text-base">
                  <Counter target={value} suffix={suffix} />
                </p>
                <p
                  className="mt-1"
                  style={{ fontSize: "10px", color: "#8a8a8a" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div {...fadeUpView(0.1)}>
            <div
              className="flex mb-5"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
            >
              {TABS.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setTab(i)}
                  className={`px-4 pb-3 text-sm font-medium transition-colors duration-150 ${tab === i ? "tab-active" : "tab-inactive"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {tabContent[tab]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* RIGHT — identity card */}
        <motion.div {...fadeUpView(0.15)} className="lg:col-span-2">
          <div className="card rounded-xl overflow-hidden">
            {/* Card header */}
            <div
              className="p-5"
              style={{
                borderBottom: "1px solid rgba(0,0,0,0.07)",
                background: "#fff",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "#2563eb" }}
                >
                  <Building2 size={18} color="white" />
                </div>
                <div>
                  <p
                    className="font-bold"
                    style={{
                      fontFamily: '"Syne", sans-serif',
                      fontSize: "14px",
                      color: "#1a1a1a",
                    }}
                  >
                    Gandaria City
                  </p>
                  <p style={{ fontSize: "11px", color: "#8a8a8a" }}>
                    by Pakuwon Jati
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="dot-live" />
                <span style={{ fontSize: "12px", color: "#4b4b4b" }}>
                  Beroperasi sejak 2010
                </span>
              </div>
            </div>

            {/* Facts */}
            <div className="p-5 space-y-3" style={{ background: "#fafaf8" }}>
              {[
                { k: "Arsitek", v: "Cadiz International" },
                { k: "Kategori", v: "Mall · Office · Hotel" },
                { k: "Konvensi", v: "Convention Center 6.200 m²" },
                { k: "Parkir", v: "PT. Centrepark Citra Corpora" },
              ].map(({ k, v }) => (
                <div
                  key={k}
                  className="flex justify-between gap-4"
                  style={{ fontSize: "12px" }}
                >
                  <span style={{ color: "#8a8a8a", flexShrink: 0 }}>{k}</span>
                  <span style={{ color: "#1a1a1a", textAlign: "right" }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-5 pb-5" style={{ background: "#fafaf8" }}>
              <a
                href="https://www.gandariacity.co.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium transition-colors"
                style={{
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#4b4b4b",
                  background: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f0ed";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                <Globe size={11} /> gandariacity.co.id{" "}
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT — About Centrepark
───────────────────────────────────────────────────────────────────── */
const AboutCentrepark: FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <Section id="about-centrepark" alt>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left Col: Header & Stats */}
        <div className="space-y-12">
          <SectionHeader
            eyebrow="Est. 1 November 2009 · Jakarta"
            title="PT. Centrepark Citra Corpora"
            sub="Perusahaan manajemen parkir terbesar dan tercepat berkembang di Indonesia — mitra strategis 700+ properti nasional."
          />

          {/* Stats Grid */}
          <motion.div
            {...fadeUpView(0.05)}
            className="grid grid-cols-2 gap-6"
          >
            {CP_STATS.map(({ value, suffix, label }) => (
              <div
                key={label}
                className="p-6 rounded-2xl glass-card text-center"
              >
                <p
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "#2563eb",
                    lineHeight: 1,
                  }}
                >
                  <Counter target={value} suffix={suffix} />
                </p>
                <p
                  className="mt-2"
                  style={{ fontSize: "11px", color: "#8a8a8a", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Col: Services & Timeline */}
        <div className="space-y-16">
          {/* Services */}
          <motion.div {...fadeUpView(0.08)}>
            <p className="label-caps mb-8">Layanan & Keunggulan</p>
            <div className="space-y-3">
              {CP_SERVICES.map(
                ({ icon: Icon, accent, accentBg, title, desc }, i) => (
                  <div key={title} className="accordion-item">
                    <button
                      onClick={() => setOpenIdx(openIdx === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 py-4 text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                          style={{ background: accentBg }}
                        >
                          <Icon size={18} style={{ color: accent }} />
                        </div>
                        <span
                          className="font-bold"
                          style={{ fontSize: "14px", color: "#1a1a1a" }}
                        >
                          {title}
                        </span>
                      </div>
                      <motion.div
                      animate={{ rotate: openIdx === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown size={18} style={{ color: "#b8b8b8" }} />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p
                          className="pb-6 pl-14 text-gray-600"
                          style={{
                            fontSize: "14px",
                            lineHeight: 1.7,
                          }}
                        >
                          {desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ),
            )}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div {...fadeUpView(0.12)}>
          <p className="label-caps mb-5">Perjalanan Perusahaan</p>
          <div className="space-y-5">
            {CP_TIMELINE.map(({ year, title, desc }, i) => {
              const isLatest = i === CP_TIMELINE.length - 1;
              return (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-4"
                >
                  {/* Year + connector */}
                  <div
                    className="flex flex-col items-center gap-0 shrink-0"
                    style={{ width: "44px" }}
                  >
                    <span
                      className="font-mono font-bold text-right w-full"
                      style={{
                        fontSize: "11px",
                        color: isLatest ? "#2563eb" : "#b8b8b8",
                      }}
                    >
                      {year}
                    </span>
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ background: isLatest ? "#2563eb" : "#d1cfc9" }}
                    />
                    {!isLatest && (
                      <div
                        className="w-px flex-1 mt-1"
                        style={{ background: "#e5e3de", minHeight: "16px" }}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-3">
                    <p
                      className="font-semibold mb-0.5"
                      style={{ fontSize: "13px", color: "#1a1a1a" }}
                    >
                      {title}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b6b6b",
                        lineHeight: 1.65,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <div
            className="mt-8 pt-6"
            style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
          >
            <a
              href="https://centrepark.co.id"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover text-sm"
            >
              <Globe size={13} /> centrepark.co.id <ExternalLink size={11} />
            </a>
          </div>
        </motion.div>
      </div>
      </div>
    </Section>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT — Footer
───────────────────────────────────────────────────────────────────── */
const Footer: FC = () => (
  <footer
    className="py-10"
    style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,0.08)" }}
  >
    <div className="max-w-[1440px] mx-auto px-20 md:px-48 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "#2563eb" }}
        >
          <Building2 size={14} color="white" />
        </div>
        <div>
          <p
            className="font-bold text-sm"
            style={{ fontFamily: '"Syne", sans-serif', color: "#1a1a1a" }}
          >
            Centrepark
          </p>
          <p style={{ fontSize: "10px", color: "#8a8a8a" }}>
            Gandaria City Operations
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center">
        <p style={{ fontSize: "12px", color: "#8a8a8a" }}>
          © 2025 PT. Centrepark Citra Corpora. All rights reserved.
        </p>
        <p
          className="flex items-center justify-center gap-1 mt-0.5"
          style={{ fontSize: "11px", color: "#b8b8b8" }}
        >
          <Shield size={9} /> Confidential · Internal Use Only
        </p>
      </div>

      {/* Version */}
      <div className="text-right">
        <p className="font-mono" style={{ fontSize: "11px", color: "#8a8a8a" }}>
          Portal v1.0.0
        </p>
        <p style={{ fontSize: "10px", color: "#b8b8b8", marginTop: "2px" }}>
          React 19 · Vite · Tailwind v4
        </p>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────────────────────────────
   ROOT — App
───────────────────────────────────────────────────────────────────── */
export default function App() {
  const { time, date } = useClock();

  return (
    <div className="relative min-h-screen">
      <div className="mesh-bg" />
      <Navbar time={time} date={date} />
      <main>
        <Hero />
        <Projects />
        <AboutCentrepark />
        <AboutGandaria />
      </main>
      <Footer />
    </div>
  );
}
