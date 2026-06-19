import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  Shirt,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../../products/hooks/useProduct";

const EcommerceNavbar = ({
  products = [],
  wishlistCount = 0,
}) => {
  const fallbackImage =
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80";

  const navigate = useNavigate();
  const { handleGetAllProducts } = useProduct();
  const storeProducts = useSelector((state) => state.product.products || []);
  const cartItems = useSelector((state) => state.cart?.items || []);

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const searchProducts = products.length > 0 ? products : storeProducts;

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchProducts.length === 0) {
      handleGetAllProducts().catch(() => { });
    }
  }, [handleGetAllProducts, searchProducts.length]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];

    return searchProducts
      .filter((product) =>
        product.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
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

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled
        ? "shadow-lg border-b border-gray-100"
        : "shadow-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between h-20 gap-6">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Shirt size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide text-black">
                STYLEHUB
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                Premium Fashion
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                onFocus={() => setShowDropdown(true)}
                className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
              />
            </div>

            {/* Search Dropdown */}
            {showDropdown && searchTerm && (
              <div className="absolute top-full mt-3 w-full bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => {
                          navigate(`/products/${product._id}`);
                          setShowDropdown(false);
                          setSearchTerm("");
                        }}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
                      >
                        <img
                          src={getProductImage(product)}
                          alt={product.title}
                          className="w-14 h-14 rounded-lg object-cover border"
                          onError={(event) => {
                            event.currentTarget.src = fallbackImage;
                          }}
                        />

                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 line-clamp-1">
                            {product.title}
                          </h3>

                          <p className="text-sm font-semibold text-black mt-1">
                            ₹
                            {product.price?.amount ||
                              product.price}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 text-center text-gray-500">
                      No products found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <button
              className="relative p-2 hover:scale-110 transition-transform"
              aria-label="Wishlist"
            >
              <Heart
                size={24}
                className="text-gray-700 hover:text-red-500 transition-colors"
              />

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
              <ShoppingCart
                size={24}
                className="text-gray-700 hover:text-black transition-colors"
              />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              className="p-2 hover:scale-110 transition-transform"
              aria-label="Profile"
            >
              <User
                size={24}
                className="text-gray-700 hover:text-black transition-colors"
              />
            </button>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Shirt size={20} />
              </div>

              <h1 className="font-bold text-lg">STYLEHUB</h1>
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center gap-4">
              <button className="relative">
                <Heart size={22} />

                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="relative"
              >
                <ShoppingCart size={22} />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button>
                <User size={22} />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="relative mt-4">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              onFocus={() => setShowDropdown(true)}
              className="w-full h-12 pl-11 pr-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10"
            />

            {/* Mobile Dropdown */}
            {showDropdown && searchTerm && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
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
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
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
                          <h4 className="font-medium text-sm line-clamp-1">
                            {product.title}
                          </h4>

                          <p className="text-sm font-semibold">
                            ₹
                            {product.price?.amount ||
                              product.price}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No products found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click Outside Overlay */}
      {showDropdown && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default EcommerceNavbar;