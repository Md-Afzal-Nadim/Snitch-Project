import React, { useState } from "react";
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingBag,
  User,
  ShieldCheck,
  RefreshCcw,
  Lock,
  Smartphone,
} from "lucide-react";

// ── Brand SVG Icons (lucide-react v1 removed brand icons) ───────────────────

const InstagramIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterXIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

// ── Data ────────────────────────────────────────────────────────────────────

const footerColumns = [
  {
    title: "ONLINE SHOPPING",
    links: ["Men", "Women", "Kids", "Home & Living", "Beauty", "Gift Cards", "Myntra Insider"],
  },
  {
    title: "CUSTOMER POLICIES",
    links: ["Contact Us", "FAQ", "T&C", "Terms Of Use", "Track Orders", "Shipping", "Cancellation", "Returns", "Privacy Policy"],
  },
  {
    title: "USEFUL LINKS",
    links: ["Blog", "Careers", "Site Map", "Corporate Information", "Whitehat", "Cleartrip"],
  },
  {
    title: "ABOUT US",
    links: ["About Myntra", "Press", "Investors", "Sustainability", "Affiliates", "Advertise with Us"],
  },
];

const trustBadges = [
  { icon: ShieldCheck, title: "100% ORIGINAL", subtitle: "Guarantee for all products at myntra.com" },
  { icon: RefreshCcw,  title: "Return within 14 days", subtitle: "Of receiving your order" },
  { icon: Lock,        title: "Secure Payments", subtitle: "100% secure payment processing" },
];

const socialLinks = [
  { icon: InstagramIcon, label: "Instagram" },
  { icon: FacebookIcon,  label: "Facebook" },
  { icon: TwitterXIcon,  label: "Twitter / X" },
  { icon: YoutubeIcon,   label: "YouTube" },
];

const navItems = [
  { id: "home",       label: "Home",       Icon: Home },
  { id: "categories", label: "Categories", Icon: LayoutGrid },
  { id: "wishlist",   label: "Wishlist",   Icon: Heart },
  { id: "cart",       label: "Bag",        Icon: ShoppingBag },
  { id: "profile",    label: "Profile",    Icon: User },
];

// ── Component ────────────────────────────────────────────────────────────────

const Footer = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <>
      {/* ═══════════════════════════════════════
          DESKTOP FOOTER  (lg and above)
      ═══════════════════════════════════════ */}
      <footer className="hidden lg:block bg-white border-t border-gray-200">

        {/* Trust Badges */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-around divide-x divide-gray-200">
            {trustBadges.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-center gap-4 px-10">
                <Icon size={32} className="text-pink-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 tracking-wide">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-5 gap-8">

            {/* Link columns */}
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold text-gray-900 tracking-widest mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-pink-500 transition-colors duration-150"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social + App column */}
            <div className="space-y-7">

              {/* Social */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 tracking-widest mb-4">
                  KEEP IN TOUCH
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-pink-500 hover:text-pink-500 transition-colors duration-150"
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
              </div>

              {/* App download */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 tracking-widest mb-4">
                  EXPERIENCE MYNTRA APP
                </h4>
                <div className="flex flex-col gap-2">
                  {["Google Play", "App Store"].map((store) => (
                    <a
                      key={store}
                      href="#"
                      className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 hover:border-pink-400 transition-colors duration-150 group"
                    >
                      <Smartphone size={18} className="text-gray-500 group-hover:text-pink-500 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400 leading-none">
                          {store === "Google Play" ? "Get it on" : "Download on the"}
                        </p>
                        <p className="text-xs font-semibold text-gray-800">{store}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">© 2024 Myntra Fashion. All rights reserved.</p>
            <p className="text-xs text-gray-400">In association with Flipkart</p>
          </div>
        </div>

      </footer>

      {/* ═══════════════════════════════════════
          MOBILE BOTTOM NAV  (below lg)
      ═══════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl
                  transition-all duration-200 ease-out min-w-[56px]
                  ${isActive
                    ? "text-pink-500 bg-pink-50 scale-105"
                    : "text-gray-400 hover:text-gray-600 active:scale-95"
                  }
                `}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  fill={isActive && ["home", "wishlist", "cart", "profile"].includes(id) ? "currentColor" : "none"}
                  className="transition-transform duration-200"
                />
                <span className={`text-[10px] font-medium leading-none tracking-wide ${isActive ? "text-pink-500" : "text-gray-400"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Spacer so page content doesn't hide behind the mobile nav */}
      <div className="lg:hidden h-16" aria-hidden="true" />
    </>
  );
};

export default Footer;