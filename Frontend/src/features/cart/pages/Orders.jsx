import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart";
import {
  Check,
  ClipboardList,
  Package,
  Truck,
  Home,
  Mail,
  Headphones,
  MapPin,
  Award,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

// Apni Redux state path ke according change karo
const selectOrder = (state) => state.cart.order;

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

/* Handles a price that's either a plain number or a {amount, currency} object */
const formatPrice = (price) => {
  if (price && typeof price === "object") return formatINR(price.amount);
  return formatINR(price);
};

const trackingSteps = [
  { id: "confirmed", label: "Order Confirmed", sub: "We've received your order", icon: ClipboardList },
  { id: "shipped", label: "Shipped", sub: "Your order is being packed", icon: Package },
  { id: "out", label: "Out for Delivery", sub: "Your order is on its way", icon: Truck },
  { id: "delivered", label: "Delivered", sub: "Enjoy your purchase", icon: Home },
];

/* Handles whichever shape the item image comes in: a string URL, an array of
   URL strings, an array of {url} objects, or nested product/variant images. */
const getItemImage = (item, variantDetail) => {
  const candidates = [
    variantDetail?.images,
    item?.product?.images,
    item?.images,
    item?.image,
    item?.thumbnail,
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (typeof candidate === "string") return candidate;
    if (Array.isArray(candidate) && candidate.length) {
      const first = candidate[0];
      if (typeof first === "string") return first;
      if (first?.url) return first.url;
    }
    if (candidate?.url) return candidate.url;
  }
  return null;
};

/* Resolves the variant object for a cart/order item, same pattern as Cart & Address pages */
const getVariantDetails = (product, variantId) => {
  if (!product?.variants || !variantId) return null;
  return product.variants;
};

/* Handles whichever field/format the order date comes in. Falls back to
   formatting a raw ISO/timestamp if that's what's stored. */
const getOrderDate = (order) => {
  const raw =
    order?.orderDate ||
    order?.createdAt ||
    order?.date ||
    order?.placedAt ||
    order?.createdOn;
  if (!raw) return null;
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) return String(raw); // already a formatted string
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reduxOrder = useSelector(selectOrder);
  const { handleGetOrderById } = useCart();

  const queryParams = new URLSearchParams(location.search);
  const orderIdFromUrl = queryParams.get("order_id");

  // Redux order is fastest (available right after checkout), but it's gone
  // after a reload. In that case, fall back to fetching from the backend
  // using the order_id in the URL — this is what makes reload reload-proof.
  const [fetchedOrder, setFetchedOrder] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const order = reduxOrder || fetchedOrder;
  const orderId = order?.orderId || orderIdFromUrl || "N/A";

  useEffect(() => {
    if (reduxOrder || !orderIdFromUrl) return; // already have it, or nothing to fetch by

    setIsFetching(true);
    handleGetOrderById(orderIdFromUrl)
      .then((payment) => {
        if (!payment) return;

        // Normalize the Payment model's shape into what this component expects
        setFetchedOrder({
          orderId: payment.razorpay?.orderId,
          orderDate: payment.createdAt,
          address: payment.addressId, // already populated by the backend
          items: (payment.orderItems ?? []).map((it) => ({
            _id: it._id,
            fullname: it.title,
            images: it.images?.[0]?.url,
            price: it.price?.amount,
            quantity: it.quantity,
          })),
          bagTotal: payment.price?.amount,
          shipping: 0,
          discount: 0,
          totalPaid: payment.price?.amount,
        });
      })
      .catch((err) => console.error("Failed to fetch order", err))
      .finally(() => setIsFetching(false));
  }, [reduxOrder, orderIdFromUrl]);

  useEffect(() => {
    if (!order && !orderIdFromUrl && !isFetching) {
      navigate("/", { replace: true });
    }
  }, [order, isFetching]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  const {
    orderDate,
    deliveryDate,
    address = {},
    items = [],
    bagTotal = 0,
    shipping = 0,
    discount = 0,
    totalPaid = 0,
    userEmail,
  } = order;

  const currentStepIndex = 0; // step 0 = "Order Confirmed" is always true right after placing the order

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ═══════════ LEFT — Success card ═══════════ */}
          <div className="w-full lg:flex-1 border border-gray-100 rounded-2xl p-6 sm:p-10">
            {/* Checkmark + confetti dots */}
            <div className="relative flex flex-col items-center text-center mb-6">
              <div className="relative mb-5">
                <span className="absolute -top-3 -left-8 w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="absolute top-1 -right-9 w-2 h-2 rounded-full bg-green-300" />
                <span className="absolute -bottom-2 -left-9 w-1 h-3 rotate-12 bg-green-300 rounded-full" />
                <span className="absolute -bottom-3 right-[-2.2rem] w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="absolute top-6 right-[-2.6rem] w-1 h-3 -rotate-12 bg-green-300 rounded-full" />
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={30} strokeWidth={3} className="text-white" />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-sm text-gray-500">
                Thank you for shopping with Urban Fit.
                <br />
                Your order has been placed successfully.
              </p>
            </div>

            {/* Order ID / Order Date box */}
            <div className="grid grid-cols-2 border border-gray-200 rounded-xl overflow-hidden mb-8">
              <div className="flex items-center gap-3 px-5 py-4 border-r border-gray-200">
                <ClipboardList size={20} className="text-gray-700 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="text-sm font-bold text-gray-900">#{orderId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <div>
                  <p className="text-xs text-gray-400">Order Date</p>
                  <p className="text-sm font-bold text-gray-900">
                    {getOrderDate(order) || deliveryDate || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <p className="text-center text-sm font-semibold text-gray-900 mb-6">
              What happens next?
            </p>
            <div className="flex items-start justify-between gap-2 sm:gap-4 mb-9 overflow-x-auto">
              {trackingSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx <= currentStepIndex;
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center text-center flex-shrink-0 w-20 sm:w-24">
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 ${
                          isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <p className="text-[11px] sm:text-xs font-bold text-gray-900">{step.label}</p>
                      <p className="text-[10px] text-gray-400 leading-snug">{step.sub}</p>
                    </div>
                    {idx < trackingSteps.length - 1 && (
                      <span className="text-gray-300 mt-4 sm:mt-5 flex-shrink-0">›</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => navigate(`/track-order?id=${orderId}`)}
                className="flex-1 bg-black text-white text-xs font-bold uppercase tracking-wide py-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Track Your Order
              </button>
              <button
                onClick={() => navigate("/home")}
                className="flex-1 border border-gray-300 text-gray-900 text-xs font-bold uppercase tracking-wide py-4 rounded-lg hover:border-gray-500 transition-colors"
              >
                Continue Shopping
              </button>
            </div>

            {/* Email confirmation / Need help */}
            <div className="grid sm:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-gray-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email Confirmation</p>
                  <p className="text-xs text-gray-400">
                    We've sent the order details to
                    <br />
                    {userEmail || address?.email || "your email address"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Headphones size={18} className="text-gray-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Need Help?</p>
                  <p className="text-xs text-gray-400">
                    Contact our support team at
                    <br />
                    support@urbanfit.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════ RIGHT — Order summary + address ═══════════ */}
          <div className="w-full lg:w-[340px] lg:flex-shrink-0 flex flex-col gap-4">
            {/* Order summary */}
            <div className="border border-gray-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              <div className="flex flex-col gap-4 mb-5">
                {items.map((item) => {
                  const product = item.product ?? item;
                  const variantId = item.variant;
                  const variantDetail = getVariantDetails(product, variantId);
                  const attributes = variantDetail?.attributes ?? {};
                  const imgSrc = getItemImage(item, variantDetail);
                  const displayPrice = item.price ?? variantDetail?.price ?? product?.price;
                  const qty = item.quantity ?? 1;

                  // Fallback flat fields (size/color) if the item wasn't stored with a variants structure
                  const size = attributes.size || item.size;
                  const color = attributes.color || item.color;

                  return (
                    <div key={item._id || item.id} className="flex gap-3">
                      <div className="w-14 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={product?.title || product?.fullname || item.fullname || item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[9px] text-gray-400">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {product?.title || product?.fullname || item.fullname || item.name}
                        </h3>
                        {(size || color || Object.keys(attributes).length > 0) && (
                          <p className="text-xs text-gray-500">
                            {Object.keys(attributes).length > 0
                              ? Object.entries(attributes)
                                  .map(([key, val]) => `${key[0].toUpperCase()}${key.slice(1)}: ${val}`)
                                  .join("  |  ")
                              : [size && `Size: ${size}`, color && `Color: ${color}`]
                                  .filter(Boolean)
                                  .join("  |  ")}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">Qty: {qty}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                        {formatPrice(displayPrice)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="h-px bg-gray-100 mb-4" />

              <div className="flex flex-col gap-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-900">{formatINR(bagTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600 font-medium">Discount</span>
                    <span className="font-semibold text-green-600">− {formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Charges</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-4" />

              <div className="flex justify-between items-baseline mb-1">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">{formatINR(totalPaid)}</span>
              </div>
              {discount > 0 && (
                <p className="text-xs font-medium text-green-600">
                  You saved {formatINR(discount)} on this order
                </p>
              )}
            </div>

            {/* Delivery address */}
            <div className="border border-gray-100 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Delivery Address</h2>
              <div className="flex gap-3">
                <MapPin size={18} className="text-gray-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">
                      {address.fullName || address.name}
                    </p>
                    {address.addressType && (
                      <span className="text-[9px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">
                        {address.addressType}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {(address.houseNo || address.line1) && (
                      <>
                        {address.houseNo || address.line1}
                        {(address.area || address.line2) && `, ${address.area || address.line2}`}
                        <br />
                      </>
                    )}
                    {address.city}
                    {address.city && address.state && ", "}
                    {address.state}
                    {address.pincode && ` - ${address.pincode}`}
                    <br />
                    {address.country || "India"}
                    {(address.mobile || address.phone) && (
                      <>&nbsp;&nbsp;|&nbsp;&nbsp;+91 {address.mobile || address.phone}</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom trust badges ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-gray-100">
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

export default Orders;



























