import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Menu, X } from "lucide-react";

/**
 * URBAN FIT — Landing Page
 * Design language: architectural / structural menswear.
 * Signature element: a measuring-tape style slide index on the right edge
 * (vertical ticks + running mm-style numbers) instead of generic dots —
 * a nod to tailoring/garment construction, which is the brand's whole thesis.
 */

const SLIDES = [
  {
    seed: "uf-concrete-01",
    label: "01 — THE OVERCOAT",
    image:
      "https://images.unsplash.com/photo-1737508945718-f693ea374914?w=1800&q=80&auto=format&fit=crop",
  },
  {
    seed: "uf-concrete-02",
    label: "02 — UTILITY LAYERS",
    image:
      "https://images.unsplash.com/photo-1611817757591-c3f345024273?w=1800&q=80&auto=format&fit=crop",
  },
  {
    seed: "uf-concrete-03",
    label: "03 — STREET LAYER",
    image:
      "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=1800&q=80&auto=format&fit=crop",
  },
  {
    seed: "uf-concrete-04",
    label: "04 — NIGHT WALK",
    image:
      "https://images.unsplash.com/photo-1542406775-ade58c52d2e4?w=1800&q=80&auto=format&fit=crop",
  },
];

const SLIDE_DURATION = 5500;

function Logo({ className = "h-9 w-9" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <circle cx="32" cy="32" r="31" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M19 20v15.5C19 40.5 24.5 44 32 44s13-3.5 13-8.5V20"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="square"
      />
      <path d="M37 20 47 31" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
    </svg>
  );
}

export default function LandingPage() {
  const [active, setActive] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setActive(i);
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % SLIDES.length);
    }, SLIDE_DURATION);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-[#F2F0EB]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');
        .uf-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .uf-body { font-family: 'Inter', sans-serif; }
        @keyframes uf-kenburns {
          0% { transform: scale(1.08) translate(0,0); }
          100% { transform: scale(1.18) translate(-1%, -1.5%); }
        }
        @keyframes uf-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes uf-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .uf-rise { animation: uf-rise 0.9s cubic-bezier(.22,.61,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .uf-kenburns { animation: none !important; }
          .uf-rise { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>

      {/* ---------- Background slider ---------- */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={s.seed}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
            style={{ opacity: active === i ? 1 : 0 }}
          >
            <img
              src={s.image}
              alt=""
              className="h-full w-full object-cover"
              style={{
                filter: "grayscale(35%) contrast(1.15) brightness(0.6)",
                animation: active === i ? "uf-kenburns 8s linear forwards" : "none",
              }}
              draggable={false}
            />
          </div>
        ))}
        {/* overlay: gradient for legibility, never fully opaque */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* ---------- Nav ---------- */}
      <header className="relative z-30 flex items-center justify-between px-5 py-5 sm:px-8 md:px-12">
        <div className="flex items-center gap-2.5">
          <Logo className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className="uf-display text-xl tracking-[0.12em] sm:text-2xl">URBAN FIT</span>
        </div>

        <nav className="hidden items-center gap-9 uf-body text-[13px] uppercase tracking-[0.14em] text-[#D8D6CE]/80 md:flex">
          <a href="#collections" className="transition-colors hover:text-white">Collections</a>
          <a href="#lookbook" className="transition-colors hover:text-white">Lookbook</a>
          <a href="#about" className="transition-colors hover:text-white">About</a>
          <a href="#contact" className="transition-colors hover:text-white">Contact</a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => navigate("/login")}
            className="uf-body px-4 py-2 text-[13px] uppercase tracking-[0.12em] text-[#D8D6CE]/80 transition-colors hover:text-white"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="border border-white/70 px-5 py-2 uf-body text-[13px] uppercase tracking-[0.12em] transition-colors hover:bg-white hover:text-black"
          >
            Sign Up
          </button>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setNavOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* mobile menu */}
      {navOpen && (
        <div className="relative z-30 mx-5 mb-2 border border-white/15 bg-black/70 backdrop-blur-md uf-body uppercase tracking-[0.12em] text-sm md:hidden">
          {["Collections", "Lookbook", "About", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="block border-b border-white/10 px-5 py-3 text-[#D8D6CE]/80 hover:text-white">
              {l}
            </a>
          ))}
          <div className="flex gap-3 p-4">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 border border-white/40 py-2.5 text-xs tracking-[0.12em]"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex-1 bg-white py-2.5 text-xs tracking-[0.12em] text-black"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* ---------- Hero content ---------- */}
      <main className="relative z-20 flex min-h-[calc(100vh-84px)] flex-col items-center justify-center px-6 text-center sm:px-10">
        {/* corner brackets — architectural reticle around the hero, the brand's "structural intent" made literal */}
        <div className="pointer-events-none absolute inset-x-4 inset-y-6 hidden border border-white/0 sm:inset-x-10 sm:block md:inset-x-16">
          <span className="absolute left-0 top-0 h-7 w-7 border-l border-t border-white/25" />
          <span className="absolute right-0 top-0 h-7 w-7 border-r border-t border-white/25" />
          <span className="absolute bottom-0 left-0 h-7 w-7 border-b border-l border-white/25" />
          <span className="absolute bottom-0 right-0 h-7 w-7 border-b border-r border-white/25" />
        </div>

        <p
          className={`uf-body mb-5 text-[11px] uppercase tracking-[0.35em] text-[#C9A876] sm:text-xs ${loaded ? "uf-rise" : "opacity-0"}`}
          style={{ animationDelay: "0.1s" }}
        >
          Architectural Menswear — Est. 2024
        </p>

        <h1
          className={`uf-display text-[15vw] leading-[0.85] text-white sm:text-[9vw] md:text-[7.5rem] lg:text-[8.5rem] ${loaded ? "uf-rise" : "opacity-0"}`}
          style={{ animationDelay: "0.25s" }}
        >
          URBAN&nbsp;FIT
        </h1>

        <p
          className={`uf-body mt-6 max-w-xl text-balance text-[15px] leading-relaxed text-[#D8D6CE]/85 sm:text-base ${loaded ? "uf-rise" : "opacity-0"}`}
          style={{ animationDelay: "0.4s" }}
        >
          Trend-forward silhouettes, cut from premium fabric, priced for real
          wardrobes — not just the runway. Every piece is built with
          restraint, precision, and intent.
        </p>

        <div
          className={`mt-9 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row ${loaded ? "uf-rise" : "opacity-0"}`}
          style={{ animationDelay: "0.55s" }}
        >
          <button
            onClick={() => navigate("/login")}
            className="uf-body border border-white/60 px-9 py-3.5 text-sm uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="uf-body bg-white px-9 py-3.5 text-sm uppercase tracking-[0.16em] text-black transition-colors duration-300 hover:bg-[#C9A876] hover:text-black"
          >
            Sign Up
          </button>
        </div>
      </main>

      {/* ---------- Signature: measuring-tape slide index, right edge ---------- */}
      <div className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-5 sm:right-6 md:flex">
        {SLIDES.map((s, i) => (
          <button
            key={s.seed}
            onClick={() => goTo(i)}
            className="group flex flex-col items-center gap-2"
            aria-label={`Go to ${s.label}`}
          >
            <span
              className={`uf-body text-[10px] tracking-[0.1em] transition-colors ${
                active === i ? "text-[#C9A876]" : "text-white/35 group-hover:text-white/70"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`block w-px transition-all duration-500 ${
                active === i ? "h-8 bg-[#C9A876]" : "h-4 bg-white/30 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>

      {/* current slide caption, bottom-left — ties the slider to real garment language */}
      <div className="absolute bottom-7 left-5 z-30 hidden sm:left-8 sm:block md:left-12">
        <p key={active} className="uf-body text-[11px] uppercase tracking-[0.25em] text-white/55" style={{ animation: "uf-fade-in 0.8s ease both" }}>
          {SLIDES[active].label}
        </p>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-7 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex md:hidden lg:flex">
        <span className="uf-body text-[10px] uppercase tracking-[0.3em] text-white/45">Scroll</span>
        <span className="h-8 w-px animate-pulse bg-white/40" />
      </div>
    </div>
  );
}
