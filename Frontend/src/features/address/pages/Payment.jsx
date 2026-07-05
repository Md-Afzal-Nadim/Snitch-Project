import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { useRazorpay } from "react-razorpay";
import { useCart } from "../../cart/hooks/useCart";
import { setOrderSuccess } from "../../cart/state/cart.slice";
import { MapPin, ShieldCheck, Info, ChevronLeft } from "lucide-react";

const formatCurrency = (amount) => `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

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

const calculateCartTotal = (items) => {
  return items.reduce((sum, item) => {
    const variantDetail = item?.variantDetails || getVariantDetails(item?.product, item?.variant);
    const unitAmount = variantDetail?.price?.amount ?? item?.price ?? item?.product?.price?.amount ?? 0;
    return sum + unitAmount * (item?.quantity ?? 1);
  }, 0);
};

const calculateDiscount = (items) => {
  return items.reduce((sum, item) => {
    const variantDetail = item?.variantDetails || getVariantDetails(item?.product, item?.variant);
    const unitAmount = variantDetail?.price?.amount ?? item?.price ?? item?.product?.price?.amount ?? 0;
    const compareAt = variantDetail?.compareAtPrice?.amount ?? item?.product?.compareAtPrice?.amount ?? 0;
    if (compareAt > unitAmount) {
      return sum + (compareAt - unitAmount) * (item?.quantity ?? 1);
    }
    return sum;
  }, 0);
};

/* ─── Checkout progress stepper — same pattern as Address.jsx ─── */
const steps = [
  { id: 1, label: "Cart" },
  { id: 2, label: "Address" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Order Summary" },
];

const Stepper = ({ current }) => (
  <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-6 px-4 py-4 sm:py-6 overflow-x-auto">
    {steps.map((step, idx) => (
      <div key={step.id} className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              step.id <= current ? "bg-black text-white" : "border border-gray-300 text-gray-400"
            }`}
          >
            {step.id}
          </div>
          <span
            className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
              step.id === current ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {step.label}
          </span>
        </div>
        {idx < steps.length - 1 && <div className="w-5 sm:w-16 h-px bg-gray-200 flex-shrink-0" />}
      </div>
    ))}
  </div>
);

export const usePayment = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();
  const { handleCreateCartOrder, handleVerifyCartOrder } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = useMemo(() => calculateCartTotal(cart.items ?? []), [cart.items]);
  const shipping = cartTotal >= 999 ? 0 : 99;

  const handleCheckout = async ({ address, discount = 0 } = {}) => {
    if (!address) {
      throw new Error("Delivery address is required for checkout.");
    }

    setIsProcessing(true);
    try {
      const order = await handleCreateCartOrder(address._id);
      const totalPaid = cartTotal + shipping - discount;

      const options = {
        key: "rzp_test_T5OrUtRdR6s4qh",
        amount: order.amount,
        currency: order.currency,
        name: "Urban Fit",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          const isValid = await handleVerifyCartOrder(response);
          if (isValid) {
            dispatch(
              setOrderSuccess({
                orderId: response.razorpay_order_id,
                address,
                items: cart.items,
                bagTotal: cartTotal,
                shipping,
                discount,
                totalPaid,
              }),
            );
            navigate(`/order-success?order_id=${response.razorpay_order_id}`);
          }
        },
        prefill: {
          name: user?.fullName,
          email: user?.email,
          contact: user?.contact,
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment checkout failed", error);
      setIsProcessing(false);
      throw error;
    }
  };

  return { handleCheckout, isProcessing, cartTotal, shipping };
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const address = location.state?.selectedAddress;
  const { handleCheckout, isProcessing, cartTotal, shipping } = usePayment();
  const discount = useMemo(() => calculateDiscount(cart.items ?? []), [cart.items]);
  const totalPaid = cartTotal + shipping - discount;

  useEffect(() => {
    if (!address) {
      navigate("/address", { replace: true });
    }
  }, [address, navigate]);

  if (!address) {
    return null;
  }

  const items = cart.items ?? [];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100">
        <Stepper current={3} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ═══════════ LEFT — Address + pay ═══════════ */}
          <div className="w-full lg:flex-1 border border-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Payment</h1>
            <p className="text-sm text-gray-500 mb-6">
              Confirm your shipping address and complete payment to place your order.
            </p>

            {/* Shipping address */}
            <div className="rounded-xl border border-gray-200 p-4 sm:p-5 mb-6 flex gap-3">
              <MapPin size={18} className="text-gray-700 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-semibold text-gray-900 capitalize">{address.addressType}</h2>
                </div>
                <p className="text-sm font-semibold text-gray-900">{address.fullName}</p>
                <p className="text-sm text-gray-500">
                  {address.houseNo}, {address.area}
                </p>
                <p className="text-sm text-gray-500">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-sm text-gray-500">+91 {address.mobile}</p>
              </div>
            </div>

            {/* Payment method info */}
            <div className="rounded-xl bg-gray-50 p-4 sm:p-5 mb-6 flex items-start gap-3">
              <ShieldCheck size={18} className="text-gray-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-0.5">Razorpay Secure Checkout</p>
                <p className="text-xs text-gray-500">
                  You'll be redirected to Razorpay to complete the payment. If it succeeds, your order is
                  confirmed immediately.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCheckout({ address, discount })}
              disabled={isProcessing || !items.length}
              className="w-full bg-black text-white py-4 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing Payment..." : `Pay ${formatCurrency(totalPaid)}`}
            </button>

            <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
              <Info size={12} className="flex-shrink-0" />
              Your payment information is encrypted and secure.
            </p>
          </div>

          {/* ═══════════ RIGHT — Order summary ═══════════ */}
          <div className="w-full lg:w-[360px] lg:flex-shrink-0 border border-gray-100 rounded-2xl p-4 sm:p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <span className="text-xs text-gray-400">{items.length} Items</span>
            </div>

            {/* Item list */}
            <div className="flex flex-col gap-4 mb-5 max-h-[340px] overflow-y-auto pr-1">
              {items.map((item) => {
                const product = item.product;
                const variantId = item.variant;
                const variantDetail = item?.variantDetails || getVariantDetails(product, variantId);
                const attributes = variantDetail?.attributes ?? {};
                const imageUrl = item?.variantImage || getDisplayImage(product, variantDetail);
                const unitAmount =
                  variantDetail?.price?.amount ?? item?.price?.amount ?? product?.price?.amount ?? 0;

                return (
                  <div key={`${product?._id}-${variantId}`} className="flex gap-3">
                    <div className="w-14 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product?.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{product?.title}</h3>
                      {Object.keys(attributes).length > 0 && (
                        <p className="text-xs text-gray-500">
                          {Object.entries(attributes)
                            .map(([key, val]) => `${key[0].toUpperCase()}${key.slice(1)}: ${val}`)
                            .join("  |  ")}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">Qty: {item.quantity ?? 1}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                      {formatCurrency(unitAmount)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="h-px bg-gray-100 mb-4" />

            <div className="flex flex-col gap-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Bag Total</span>
                <span className="font-semibold text-gray-900">{formatCurrency(cartTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">Discount</span>
                  <span className="font-semibold text-green-600">- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </span>
              </div>
            </div>

            <div className="h-px bg-gray-100 mb-4" />

            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Total Payable</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(totalPaid)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;




















/*import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { useRazorpay } from "react-razorpay";
import { useCart } from "../../cart/hooks/useCart";
import { setOrderSuccess } from "../../cart/state/cart.slice";
import { MapPin, ShieldCheck, Info, ChevronLeft } from "lucide-react";

const formatCurrency = (amount) => `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

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

const calculateCartTotal = (items) => {
  return items.reduce((sum, item) => {
    const variantDetail = item?.variantDetails || getVariantDetails(item?.product, item?.variant);
    const unitAmount = variantDetail?.price?.amount ?? item?.price ?? item?.product?.price?.amount ?? 0;
    return sum + unitAmount * (item?.quantity ?? 1);
  }, 0);
};

const calculateDiscount = (items) => {
  return items.reduce((sum, item) => {
    const variantDetail = item?.variantDetails || getVariantDetails(item?.product, item?.variant);
    const unitAmount = variantDetail?.price?.amount ?? item?.price ?? item?.product?.price?.amount ?? 0;
    const compareAt = variantDetail?.compareAtPrice?.amount ?? item?.product?.compareAtPrice?.amount ?? 0;
    if (compareAt > unitAmount) {
      return sum + (compareAt - unitAmount) * (item?.quantity ?? 1);
    }
    return sum;
  }, 0);
};

/* ─── Checkout progress stepper — same pattern as Address.jsx ─── 
const steps = [
  { id: 1, label: "Cart" },
  { id: 2, label: "Address" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Order Summary" },
];

const Stepper = ({ current }) => (
  <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-6 px-4 py-4 sm:py-6 overflow-x-auto">
    {steps.map((step, idx) => (
      <div key={step.id} className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step.id <= current ? "bg-black text-white" : "border border-gray-300 text-gray-400"
              }`}
          >
            {step.id}
          </div>
          <span
            className={`text-xs sm:text-sm font-medium whitespace-nowrap ${step.id === current ? "text-gray-900" : "text-gray-400"
              }`}
          >
            {step.label}
          </span>
        </div>
        {idx < steps.length - 1 && <div className="w-5 sm:w-16 h-px bg-gray-200 flex-shrink-0" />}
      </div>
    ))}
  </div>
);

export const usePayment = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();
  const { handleCreateCartOrder, handleVerifyCartOrder } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = useMemo(() => calculateCartTotal(cart.items ?? []), [cart.items]);
  const shipping = cartTotal >= 999 ? 0 : 99;

  const handleCheckout = async ({ address, discount = 0 } = {}) => {
    if (!address) {
      throw new Error("Delivery address is required for checkout.");
    }

    setIsProcessing(true);
    try {
      const order = await handleCreateCartOrder();
      const totalPaid = cartTotal + shipping - discount;

      const options = {
        key: "rzp_test_T5OrUtRdR6s4qh",
        amount: order.amount,
        currency: order.currency,
        name: "Urban Fit",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          const isValid = await handleVerifyCartOrder(response);
          if (isValid) {
            dispatch(
              setOrderSuccess({
                orderId: response.razorpay_order_id,
                address,
                items: cart.items,
                bagTotal: cartTotal,
                shipping,
                discount,
                totalPaid,
                paymentStatus: "paid",
              }),
            );
            navigate(`/order-success?order_id=${response.razorpay_order_id}`);
          }
        },
        prefill: {
          name: user?.fullName,
          email: user?.email,
          contact: user?.contact,
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment checkout failed", error);
      setIsProcessing(false);
      throw error;
    }
  };

  return { handleCheckout, isProcessing, cartTotal, shipping };
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const address = location.state?.selectedAddress;
  const { handleCheckout, isProcessing, cartTotal, shipping } = usePayment();
  const discount = useMemo(() => calculateDiscount(cart.items ?? []), [cart.items]);
  const totalPaid = cartTotal + shipping - discount;

  useEffect(() => {
    if (!address) {
      navigate("/address", { replace: true });
    }
  }, [address, navigate]);

  if (!address) {
    return null;
  }

  const items = cart.items ?? [];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100">
        <Stepper current={3} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ═══════════ LEFT — Address + pay ═══════════ 
          <div className="w-full lg:flex-1 border border-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Payment</h1>
            <p className="text-sm text-gray-500 mb-6">
              Confirm your shipping address and complete payment to place your order.
            </p>

            {/* Shipping address 
            <div className="rounded-xl border border-gray-200 p-4 sm:p-5 mb-6 flex gap-3">
              <MapPin size={18} className="text-gray-700 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-semibold text-gray-900 capitalize">{address.addressType}</h2>
                </div>
                <p className="text-sm font-semibold text-gray-900">{address.fullName}</p>
                <p className="text-sm text-gray-500">
                  {address.houseNo}, {address.area}
                </p>
                <p className="text-sm text-gray-500">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-sm text-gray-500">+91 {address.mobile}</p>
              </div>
            </div>

            {/* Payment method info 
            <div className="rounded-xl bg-gray-50 p-4 sm:p-5 mb-6 flex items-start gap-3">
              <ShieldCheck size={18} className="text-gray-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-0.5">Razorpay Secure Checkout</p>
                <p className="text-xs text-gray-500">
                  You'll be redirected to Razorpay to complete the payment. If it succeeds, your order is
                  confirmed immediately.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCheckout({ address, discount })}
              disabled={isProcessing || !items.length}
              className="w-full bg-black text-white py-4 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing Payment..." : `Pay ${formatCurrency(totalPaid)}`}
            </button>

            <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
              <Info size={12} className="flex-shrink-0" />
              Your payment information is encrypted and secure.
            </p>
          </div>

          {/* ═══════════ RIGHT — Order summary ═══════════ 
          <div className="w-full lg:w-[360px] lg:flex-shrink-0 border border-gray-100 rounded-2xl p-4 sm:p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <span className="text-xs text-gray-400">{items.length} Items</span>
            </div>

            {/* Item list 
            <div className="flex flex-col gap-4 mb-5 max-h-[340px] overflow-y-auto pr-1">
              {items.map((item) => {
                const product = item.product;
                const variantId = item.variant;
                const variantDetail = item?.variantDetails || getVariantDetails(product, variantId);
                const attributes = variantDetail?.attributes ?? {};
                const imageUrl = item?.variantImage || getDisplayImage(product, variantDetail);
                const unitAmount =
                  variantDetail?.price?.amount ?? item?.price?.amount ?? product?.price?.amount ?? 0;

                return (
                  <div key={`${product?._id}-${variantId}`} className="flex gap-3">
                    <div className="w-14 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product?.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{product?.title}</h3>
                      {Object.keys(attributes).length > 0 && (
                        <p className="text-xs text-gray-500">
                          {Object.entries(attributes)
                            .map(([key, val]) => `${key[0].toUpperCase()}${key.slice(1)}: ${val}`)
                            .join("  |  ")}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">Qty: {item.quantity ?? 1}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                      {formatCurrency(unitAmount)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="h-px bg-gray-100 mb-4" />

            <div className="flex flex-col gap-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Bag Total</span>
                <span className="font-semibold text-gray-900">{formatCurrency(cartTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">Discount</span>
                  <span className="font-semibold text-green-600">- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </span>
              </div>
            </div>

            <div className="h-px bg-gray-100 mb-4" />

            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Total Payable</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(totalPaid)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;*/