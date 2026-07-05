import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart";
import { Link, useNavigate } from "react-router";
import {
  Minus,
  Plus,
  X,
  Heart,
  ChevronLeft,
  ShieldCheck,
  RotateCcw,
  Truck,
  Award,
  Tag,
} from "lucide-react";

/* ─── lucide-react v1.x has no brand/payment icons — custom inline SVG badges, same pattern used for social icons elsewhere in the project ─── */
const PaymentBadge = ({ bg, children }) => (
  <div
    className="h-8 min-w-[52px] px-2.5 flex items-center justify-center rounded"
    style={{ backgroundColor: bg }}
  >
    {children}
  </div>
);

const VisaMark = () => (
  <svg width="34" height="11" viewBox="0 0 34 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="9" fontFamily="Arial, sans-serif" fontWeight="800" fontStyle="italic" fontSize="11" fill="#ffffff" letterSpacing="0.5">
      VISA
    </text>
  </svg>
);

const MastercardMark = () => (
  <svg width="28" height="16" viewBox="0 0 28 16" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="8" r="8" fill="#EB001B" />
    <circle cx="18" cy="8" r="8" fill="#F79E1B" fillOpacity="0.9" />
  </svg>
);

const UpiMark = () => (
  <svg width="26" height="11" viewBox="0 0 26 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="9" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="10" fill="#ffffff" letterSpacing="0.5">
      UPI
    </text>
  </svg>
);

const PaytmMark = () => (
  <svg width="42" height="11" viewBox="0 0 42 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="9" fontFamily="Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="10" fill="#002E6E" letterSpacing="0.2">
      Paytm
    </text>
  </svg>
);

const RuPayMark = () => (
  <svg width="38" height="11" viewBox="0 0 38 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="9" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="10" fill="#ffffff" letterSpacing="0.2">
      RuPay
    </text>
  </svg>
);

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const {
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
  } = useCart();
  const navigate = useNavigate();

  /* Local quantity state — key: cartItem._id, value: number */
  const [quantities, setQuantities] = useState({});
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    handleGetCart();
  }, []);

  const changeQty = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  /* ─── Helpers ─── */
  const getVariantDetails = (product, variantId) => {
    if (!product || !variantId) return null;

    if (Array.isArray(product.variants)) {
      return product.variants.find((variant) => variant?._id?.toString() === variantId?.toString()) || null;
    }

    if (product.variants && product.variants._id?.toString() === variantId?.toString()) {
      return product.variants;
    }

    return null;
  };

  const getDisplayImage = (product, variant) => {
    const variantImage = variant?.images?.find((img) => img?.url)?.url;
    if (variantImage) return variantImage;

    const productImage = product?.images?.find((img) => img?.url)?.url;
    if (productImage) return productImage;

    return null;
  };

  const formatCurrency = (amount) => `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

  /* Navigate to the next checkout step (address selection). Payment/Razorpay
     logic lives in its own file now, so this component stays UI-only. */
  const handleCheckout = () => {
    navigate("/address");
  };

  /* ─── Empty state ─── */
  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-5 md:px-10 pt-8 pb-6 flex items-center justify-between border-b border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Cart</h1>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <Link to="/" className="hover:text-gray-600">Home</Link>
              <ChevronLeft size={12} className="rotate-180" />
              <span>Cart</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black"
          >
            <ChevronLeft size={16} />
            Continue Shopping
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-2xl font-semibold text-gray-900">Your cart is empty</p>
          <p className="text-sm text-gray-500">Looks like you haven't added anything yet.</p>
          <Link
            to="/"
            className="mt-2 px-8 py-3 bg-black text-white text-sm font-semibold rounded hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Derived pricing (falls back gracefully if compareAtPrice isn't present) ─── */
  const itemsPricing = cart.items.map((item) => {
    const { product, variant: variantId, price, product: { _id } } = item;
    const variantDetail = item?.variantDetails || getVariantDetails(product, variantId);
    const displayPrice = variantDetail?.price ?? item?.variantDetails?.price ?? price ?? product?.price;
    const qty = quantities[_id] ?? item.quantity ?? 1;
    const compareAt =
      variantDetail?.compareAtPrice?.amount ??
      product?.compareAtPrice?.amount ??
      null;
    const unitAmount = displayPrice?.amount ?? 0;
    const hasDiscount = compareAt && compareAt > unitAmount;
    const discountPct = hasDiscount
      ? Math.round(((compareAt - unitAmount) / compareAt) * 100)
      : 0;
    return { item, product, variantId, variantDetail, displayPrice, qty, compareAt, hasDiscount, discountPct, unitAmount, _id };
  });

  const totalDiscount = itemsPricing.reduce(
    (sum, p) => sum + (p.hasDiscount ? (p.compareAt - p.unitAmount) * p.qty : 0),
    0,
  );
  const subtotal = cart.totalPrice ?? itemsPricing.reduce((s, p) => s + p.unitAmount * p.qty, 0);
  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const totalAmount = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Header ── */}
      <div className="px-5 md:px-10 pt-8 pb-5 flex items-start justify-between border-b border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Cart ({cart.items.length} {cart.items.length === 1 ? "Item" : "Items"})
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
            <Link to="/" className="hover:text-gray-600">Home</Link>
            <span>›</span>
            <span className="text-gray-500">Cart</span>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black transition-colors mt-1"
        >
          <ChevronLeft size={16} />
          Continue Shopping
        </button>
      </div>

      <div className="px-5 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ═══════════ LEFT — Product table ═══════════ */}
          <div className="w-full lg:flex-1 border border-gray-100 rounded-lg overflow-hidden">
            {/* Table header (desktop only) */}
            <div className="hidden md:grid grid-cols-[2.2fr_0.9fr_1fr_0.9fr] gap-4 px-6 py-4 bg-gray-50 text-[11px] font-bold uppercase tracking-wide text-gray-500">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <div className="divide-y divide-gray-100">
              {itemsPricing.map(
                ({ item, product, variantId, variantDetail, displayPrice, qty, compareAt, hasDiscount, discountPct, unitAmount, _id }) => {
                  const imageUrl = item?.variantImage || getDisplayImage(product, variantDetail);
                  const attributes = variantDetail?.attributes ?? {};
                  const lineTotal = unitAmount * qty;

                  return (
                    <div
                      key={`${_id}-${variantId}`}
                      className="grid grid-cols-1 md:grid-cols-[2.2fr_0.9fr_1fr_0.9fr] gap-4 px-6 py-6 items-start md:items-center relative"
                    >
                      {/* Product */}
                      <div className="flex gap-4">
                        <div className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          {imageUrl ? (
                            <img src={imageUrl} alt={product?.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">
                            {product?.title}
                          </h3>
                          {Object.keys(attributes).length > 0 && (
                            <p className="text-xs text-gray-500">
                              {Object.entries(attributes)
                                .map(([key, val]) => `${key[0].toUpperCase()}${key.slice(1)}: ${val}`)
                                .join("  |  ")}
                            </p>
                          )}
                          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded px-2.5 py-1.5 w-fit mt-1 hover:border-gray-400 transition-colors">
                            <Heart size={12} />
                            Move to Wishlist
                          </button>
                          {/* mobile-only price/total */}
                          <div className="flex items-center gap-3 mt-1 md:hidden">
                            <span className="text-sm font-bold text-gray-900">{formatCurrency(unitAmount)}</span>
                            {hasDiscount && (
                              <>
                                <span className="text-xs text-gray-400 line-through">{formatCurrency(compareAt)}</span>
                                <span className="text-xs font-semibold text-green-600">{discountPct}% OFF</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Price (desktop) */}
                      <div className="hidden md:flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(unitAmount)}</span>
                        {hasDiscount && (
                          <>
                            <span className="text-xs text-gray-400 line-through">{formatCurrency(compareAt)}</span>
                            <span className="text-xs font-semibold text-green-600">{discountPct}% OFF</span>
                          </>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="flex md:block">
                        <div className="flex items-center border border-gray-200 rounded w-fit">
                          <button
                            id={`qty-dec-${_id}`}
                            onClick={() => handleDecrementCartItem({ productId: _id, variantId })}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-gray-900 select-none">
                            {qty}
                          </span>
                          <button
                            id={`qty-inc-${_id}`}
                            onClick={() => handleIncrementCartItem({ productId: _id, variantId })}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Total + remove */}
                      <div className="flex items-center justify-between md:justify-start gap-3">
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(lineTotal)}</span>
                        <button
                          id={`remove-${_id}`}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                          aria-label="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            {/* Coupon + trust strip */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 px-6 py-5 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 flex-1">
                <Tag size={16} className="text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-700">Have a coupon?</p>
                  <p className="text-[11px] text-gray-400">Enter your coupon code</p>
                </div>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="hidden sm:block flex-1 max-w-[220px] text-xs border border-gray-200 rounded px-3 py-2 outline-none focus:border-gray-400"
                />
                <button className="bg-black text-white text-xs font-semibold px-5 py-2 rounded hover:bg-gray-800 transition-colors">
                  Apply
                </button>
              </div>

              <div className="hidden lg:flex items-center gap-6 border-l border-gray-200 pl-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-gray-500" />
                  <div>
                    <p className="text-[11px] font-semibold text-gray-700">100% Secure</p>
                    <p className="text-[10px] text-gray-400">Payments</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={16} className="text-gray-500" />
                  <div>
                    <p className="text-[11px] font-semibold text-gray-700">Easy Returns</p>
                    <p className="text-[10px] text-gray-400">Within 7 Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gray-500" />
                  <div>
                    <p className="text-[11px] font-semibold text-gray-700">Free Delivery</p>
                    <p className="text-[10px] text-gray-400">On orders above ₹999</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════ RIGHT — Order summary ═══════════ */}
          <div className="w-full lg:w-[340px] lg:flex-shrink-0 border border-gray-100 rounded-lg p-6 lg:sticky lg:top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({cart.items.length} items)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(subtotal + totalDiscount)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-semibold text-green-600">- {formatCurrency(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Charges</span>
                <span className="font-semibold text-gray-900">
                  {deliveryCharge === 0 ? "Free" : formatCurrency(deliveryCharge)}
                </span>
              </div>
            </div>

            <div className="h-px bg-gray-100 my-4" />

            <div className="flex justify-between items-baseline mb-1">
              <span className="text-base font-bold text-gray-900">Total Amount</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
            </div>
            {totalDiscount > 0 && (
              <p className="text-xs font-medium text-green-600 mb-4">
                You saved {formatCurrency(totalDiscount)} on this order
              </p>
            )}

            <button
              id="proceed-checkout"
              onClick={handleCheckout}
              className="w-full mt-3 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-wide rounded hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </button>
            <button
              id="buy-now"
              onClick={handleCheckout}
              className="w-full mt-3 py-3.5 bg-white text-gray-900 text-sm font-bold uppercase tracking-wide rounded border border-gray-300 hover:border-gray-500 transition-colors"
            >
              Buy Now
            </button>

            <div className="h-px bg-gray-100 my-5" />

            <p className="text-xs font-semibold text-gray-600 mb-2.5">We Accept</p>
            <div className="flex flex-wrap gap-2">
              <PaymentBadge bg="#1a1f71"><VisaMark /></PaymentBadge>
              <PaymentBadge bg="#ffffff"><MastercardMark /></PaymentBadge>
              <PaymentBadge bg="#097939"><UpiMark /></PaymentBadge>
              <PaymentBadge bg="#e8f7fd"><PaytmMark /></PaymentBadge>
              <PaymentBadge bg="#0a2e5c"><RuPayMark /></PaymentBadge>
            </div>
          </div>
        </div>

        {/* ── Bottom trust badges ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
              <Award size={20} className="text-gray-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Premium Quality</p>
              <p className="text-xs text-gray-400">Finest fabrics for ultimate comfort</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
              <RotateCcw size={20} className="text-gray-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
              <p className="text-xs text-gray-400">Hassle free returns within 7 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
              <Truck size={20} className="text-gray-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
              <p className="text-xs text-gray-400">On orders above ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} className="text-gray-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
              <p className="text-xs text-gray-400">100% safe & secure transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;