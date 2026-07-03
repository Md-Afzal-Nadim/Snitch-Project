import React, { useState } from "react";
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingBag,
  User,
  Award,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Headphones,
  Store,
  Send,
} from "lucide-react";

// ── Social Media Icons ──────────────────────────────────────────────────────

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterXIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
  </svg>
);

// ── Data Matching the Image ──────────────────────────────────────────────────

const topFeatures = [
  { icon: Award, title: "PREMIUM QUALITY", desc: "Finest fabrics for ultimate comfort" },
  { icon: Truck, title: "FAST DELIVERY", desc: "Quick & reliable delivery" },
  { icon: ShieldCheck, title: "SECURE PAYMENT", desc: "100% safe & secure transactions" },
  { icon: RefreshCcw, title: "EASY RETURNS", desc: "Hassle free returns within 7 days" },
  { icon: Headphones, title: "24/7 SUPPORT", desc: "We're always here to help you" },
  { icon: Store, title: "TRUSTED MARKETPLACE", desc: "Verified sellers, genuine products" },
];

const footerLinks = [
  {
    title: "SHOP",
    links: ["Men's Wear", "Shirts", "T-Shirts", "Jeans", "Jackets", "Footwear", "Accessories", "New Arrivals", "Best Sellers"],
  },
  {
    title: "COMPANY",
    links: ["About Us", "How It Works", "Sell on Urban Fit", "Our Blog", "Careers", "Privacy Policy", "Terms & Conditions", "Shipping Policy", "Return Policy"],
  },
  {
    title: "HELP & SUPPORT",
    links: ["Contact Us", "FAQs", "Size Guide", "Track Order", "Returns & Refunds", "Payment Options"],
  },
];

const socialLinks = [
  { icon: InstagramIcon, label: "Instagram" },
  { icon: FacebookIcon, label: "Facebook" },
  { icon: TwitterXIcon, label: "Twitter / X" },
  { icon: YoutubeIcon, label: "YouTube" },
];

const paymentMethods = [
  /*{ name: "Visa", url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },*/
  { name: "Mastercard", url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
  { name: "UPI", url: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" },
  { name: "Paytm", url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" },
  /*{ name: "RuPay", url: "https://upload.wikimedia.org/wikipedia/commons/d/d1/RuPay_logo.svg" },*/
];

const navItems = [
  { id: "home", label: "Home", Icon: Home },
  { id: "categories", label: "Categories", Icon: LayoutGrid },
  { id: "wishlist", label: "Wishlist", Icon: Heart },
  { id: "cart", label: "Bag", Icon: ShoppingBag },
  { id: "profile", label: "Profile", Icon: User },
];

// ── Component ────────────────────────────────────────────────────────────────

const Footer = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail("");
  };

  return (
    <>
      {/* ═══════════════════════════════════════
          DESKTOP FOOTER (lg and above)
          ═══════════════════════════════════════ */}
      <footer className="hidden lg:block bg-[#050505] text-white font-sans border-t border-zinc-900">
        
        {/* Top Features / Badges Row */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 border-b border-zinc-900">
          {topFeatures.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center px-2">
              <Icon size={28} className="text-zinc-300 stroke-[1.5] mb-3" />
              <h5 className="text-[11px] font-bold tracking-wider text-zinc-100 uppercase mb-1">{title}</h5>
              <p className="text-[11px] text-zinc-400 font-normal leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Main Columns Content */}
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Brand Information Column */}
            <div className="col-span-3 flex flex-col justify-between pr-4">
              <div>
                {/* Custom Brand Logo matching image structure */}
                <div className="mb-4">
                  <div className="text-4xl font-extrabold tracking-tighter text-white leading-none">UⲘ</div>
                  <div className="text-lg font-bold tracking-[0.25em] text-white uppercase mt-1">URBAN FIT</div>
                  <div className="text-[8px] tracking-[0.3em] text-zinc-400 uppercase mt-0.5 font-medium">STYLE THAT DEFINES YOU</div>
                </div>
                <p className="text-[12px] text-zinc-400 leading-relaxed mb-6 font-normal">
                  Urban Fit is your ultimate destination for premium men's fashion. Top quality products from trusted sellers, all in one place.
                </p>
              </div>
              
              {/* Social Media Row */}
              <div className="flex gap-2.5">
                {socialLinks.map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-white hover:text-white transition-colors duration-200 bg-zinc-950"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Dynamic Link Columns mapping SHOP, COMPANY, HELP & SUPPORT */}
            {footerLinks.map((col) => (
              <div key={col.title} className="col-span-2">
                <h4 className="text-[12px] font-bold text-white tracking-widest uppercase mb-5 relative after:content-[''] after:block after:w-6 after:h-[2px] after:bg-zinc-700 after:mt-1.5">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[12px] text-zinc-400 hover:text-white transition-colors duration-150 font-normal"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter and Payment Row Column */}
            <div className="col-span-3 space-y-8 pl-4">
              {/* Newsletter Block */}
              <div>
                <h4 className="text-[12px] font-bold text-white tracking-widest uppercase mb-5 relative after:content-[''] after:block after:w-6 after:h-[2px] after:bg-zinc-700 after:mt-1.5">
                  NEWSLETTER
                </h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed mb-4">
                  Subscribe to get updates on new arrivals, exclusive offers and more.
                </p>
                <form onSubmit={handleSubscribe} className="relative flex items-center">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-zinc-800 rounded px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors duration-150 pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 text-zinc-400 hover:text-white transition-colors p-1"
                    aria-label="Submit email"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>

              {/* Payment Methods Info */}
              <div>
                <h4 className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase mb-3.5">
                  WE ACCEPT
                </h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {paymentMethods.map((pm) => (
                    <div 
                      key={pm.name} 
                      className="bg-white px-2.5 py-1.5 rounded flex items-center justify-center h-7 min-w-[42px]"
                    >
                      <img 
                        src={pm.url} 
                        alt={pm.name} 
                        className="max-h-4 object-contain brightness-95" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="border-t border-zinc-900 bg-[#020202]">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-[11px] text-zinc-500 font-normal">
            <p>© 2024 Urban Fit. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
              <span className="text-zinc-800">|</span>
              <a href="#" className="hover:text-zinc-300 transition-colors">Terms & Conditions</a>
              <span className="text-zinc-800">|</span>
              <a href="#" className="hover:text-zinc-300 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>

      </footer>

      {/* ═══════════════════════════════════════
          MOBILE BOTTOM NAV (below lg)
          ═══════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d] border-t border-zinc-800 shadow-[0_-4px_16px_rgba(0,0,0,0.4)]"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex flex-col items-center justify-center gap-1 px-2.5 py-1 rounded-xl
                  transition-all duration-200 ease-out min-w-[56px]
                  ${isActive
                    ? "text-white bg-zinc-800 scale-105"
                    : "text-zinc-500 hover:text-zinc-300 active:scale-95"
                  }
                `}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  fill={isActive && ["home", "wishlist", "cart", "profile"].includes(id) ? "currentColor" : "none"}
                  className="transition-transform duration-200"
                />
                <span className={`text-[9px] font-semibold leading-none tracking-wide ${isActive ? "text-white" : "text-zinc-500"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Spacer so page content doesn't hide behind mobile nav */}
      <div className="lg:hidden h-16 bg-[#050505]" aria-hidden="true" />
    </>
  );
};

export default Footer;