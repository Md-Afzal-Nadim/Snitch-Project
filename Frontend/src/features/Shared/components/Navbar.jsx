import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../../products/hooks/useProduct";

const Navbar = ({
  products = [],
  wishlistCount = 0,
}) => {
  const fallbackImage =
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80";

  const navigate = useNavigate();
  const location = useLocation();
  const { handleGetAllProducts } = useProduct();
  const storeProducts = useSelector((state) => state.product.products || []);
  const cart = useSelector((state) => state.cart?.items || []);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const searchProducts = products.length > 0 ? products : storeProducts;

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (searchProducts.length === 0) {
      handleGetAllProducts().catch(() => {});
    }
  }, [handleGetAllProducts, searchProducts.length]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];

    return searchProducts
      .filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
  }, [searchProducts, searchTerm]);

  const getProductImage = (product) => {
    const firstImage = product.images?.[0];

    return (
      (typeof firstImage === "string" && firstImage) ||
      firstImage?.url ||
      firstImage?.secure_url ||
      product.image ||
      fallbackImage
    );
  };

  const navLinks = [
    { label: "HOME", path: "/home" },
    { label: "SHOP", path: "/home" },
    { label: "CATEGORIES", path: "/categories", dropdown: true },
    { label: "SELL ON URBAN FIT", path: "/home" },
    { label: "ABOUT US", path: "/home" },
    { label: "CONTACT", path: "/home" },
  ];

  const categoryOptions = ["T-Shirts", "Shirts", "Jeans", "Jackets", "Footwear"];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-black">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between h-20 gap-6">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-md bg-white text-black flex items-center justify-center font-bold text-lg tracking-tighter">
              UF
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-widest text-white leading-none">
                URBAN FIT
              </h1>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-8">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                >
                  <button
                    className={`flex items-center gap-1 text-xs font-semibold tracking-wide text-white/80 hover:text-white transition-colors pb-1 ${
                      isActive(link.path)
                        ? "text-white border-b-2 border-white"
                        : ""
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} />
                  </button>

                  {showCategories && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-black border border-white/10 rounded-lg shadow-xl overflow-hidden">
                      {categoryOptions.map((cat) => (
                        <div
                          key={cat}
                          onClick={() =>
                            navigate(`/categories?name=${cat.toLowerCase()}`)
                          }
                          className="px-4 py-3 text-xs text-white/80 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className={`text-xs font-semibold tracking-wide text-white/80 hover:text-white transition-colors pb-1 ${
                    isActive(link.path)
                      ? "text-white border-b-2 border-white"
                      : ""
                  }`}
                >
                  {link.label}
                </button>
              )
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-5 relative">
            {/* Search */}
            <div className="relative">
              <button
                className="p-2 hover:scale-110 transition-transform"
                aria-label="Search"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <Search size={20} className="text-white/90 hover:text-white transition-colors" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-black border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-white/10">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search for products..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 text-sm"
                    />
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {searchTerm.trim() === "" ? null : filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => {
                            navigate(`/products/${product._id}`);
                            setShowDropdown(false);
                            setSearchTerm("");
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
                        >
                          <img
                            src={getProductImage(product)}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover border border-white/10"
                            onError={(event) => {
                              event.currentTarget.src = fallbackImage;
                            }}
                          />

                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-white line-clamp-1">
                              {product.title}
                            </h3>
                            <p className="text-xs font-semibold text-white/70 mt-1">
                              ₹{product.price?.amount || product.price}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-white/50 text-sm">
                        No products found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button className="relative p-2 hover:scale-110 transition-transform" aria-label="Wishlist">
              <Heart size={20} className="text-white/90 hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 hover:scale-110 transition-transform"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="text-white/90 hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button className="p-2 hover:scale-110 transition-transform" aria-label="Profile">
              <User size={20} className="text-white/90 hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden py-3">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="shrink-0 p-1"
              aria-label="Menu"
            >
              <Menu size={24} className="text-white/90" />
            </button>

            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center shrink-0 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-md bg-white text-black flex items-center justify-center font-bold text-base">
                UF
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onFocus={() => setShowDropdown(true)}
                className="w-full h-11 pl-11 pr-4 rounded-full bg-white/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/30 text-sm"
              />

              {showDropdown && searchTerm.trim() !== "" && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-black border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => {
                            navigate(`/products/${product._id}`);
                            setSearchTerm("");
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-b-0"
                        >
                          <img
                            src={getProductImage(product)}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(event) => {
                              event.currentTarget.src = fallbackImage;
                            }}
                          />
                          <div>
                            <h4 className="font-medium text-sm text-white line-clamp-1">
                              {product.title}
                            </h4>
                            <p className="text-xs font-semibold text-white/70">
                              ₹{product.price?.amount || product.price}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-white/50 text-sm">
                        No products found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative shrink-0 p-1"
              aria-label="Cart"
            >
              <ShoppingCart size={22} className="text-white/90" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] min-w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Click Outside Overlay */}
      {showDropdown && (
        <div className="fixed inset-0 -z-10" onClick={() => setShowDropdown(false)} />
      )}

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowMobileMenu(false)}
          />

          <div className="absolute top-0 left-0 h-full w-72 bg-black border-r border-white/10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-md bg-white text-black flex items-center justify-center font-bold text-base">
                  UF
                </div>
                <h1 className="font-bold text-sm tracking-widest text-white">
                  URBAN FIT
                </h1>
              </div>

              <button
                onClick={() => setShowMobileMenu(false)}
                aria-label="Close menu"
              >
                <X size={22} className="text-white/80" />
              </button>
            </div>

            <nav className="flex flex-col py-2 overflow-y-auto">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setShowCategories((prev) => !prev)}
                      className={`w-full flex items-center justify-between px-5 py-3 text-sm font-semibold tracking-wide text-white/80 hover:bg-white/10 hover:text-white transition-colors ${
                        isActive(link.path) ? "text-white bg-white/5" : ""
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          showCategories ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showCategories && (
                      <div className="bg-white/5">
                        {categoryOptions.map((cat) => (
                          <div
                            key={cat}
                            onClick={() => {
                              navigate(`/categories?name=${cat.toLowerCase()}`);
                              setShowMobileMenu(false);
                            }}
                            className="px-8 py-2.5 text-xs text-white/70 hover:text-white cursor-pointer transition-colors"
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => {
                      navigate(link.path);
                      setShowMobileMenu(false);
                    }}
                    className={`text-left px-5 py-3 text-sm font-semibold tracking-wide text-white/80 hover:bg-white/10 hover:text-white transition-colors ${
                      isActive(link.path) ? "text-white bg-white/5" : ""
                    }`}
                  >
                    {link.label}
                  </button>
                )
              )}
            </nav>

            <div className="mt-auto border-t border-white/10 flex items-center gap-4 px-5 py-4">
              <button
                onClick={() => setShowMobileMenu(false)}
                className="relative flex items-center gap-2 text-white/80 text-xs font-medium"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2 text-white/80 text-xs font-medium"
                aria-label="Profile"
              >
                <User size={18} />
                Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;