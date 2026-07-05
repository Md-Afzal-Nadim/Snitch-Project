import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAddress } from "../hooks/useAddress";
import { Pencil, Trash2, Plus, ShieldCheck } from "lucide-react";

/* ─── Checkout progress stepper ─── */
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
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step.id === current
              ? "bg-black text-white"
              : step.id < current
                ? "bg-black text-white"
                : "border border-gray-300 text-gray-400"
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
        {idx < steps.length - 1 && (
          <div className="w-5 sm:w-16 h-px bg-gray-200 flex-shrink-0" />
        )}
      </div>
    ))}
  </div>
);



const Address = () => {
  const cart = useSelector((state) => state.cart);

  const { addresses, loading, fetchAddresses, createAddress, removeAddress } =
    useAddress();



  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    state: "",
    city: "",
    houseNo: "",
    area: "",
    landmark: "",
    addressType: "home",
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [instructions, setInstructions] = useState("");



  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (addresses?.length && !selectedId) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedId(def._id);
    }
  }, [addresses]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createAddress(form);

    setForm({
      fullName: "",
      mobile: "",
      pincode: "",
      state: "",
      city: "",
      houseNo: "",
      area: "",
      landmark: "",
      addressType: "home",
    });

    setShowForm(false);
    fetchAddresses();
  };

  const formatCurrency = (amount) => `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

  /* ─── Order summary derived values ─── */
  const items = cart?.items ?? [];
  const getVariantDetails = (product, variantId) => {
    if (!product || !variantId) return null;

    if (Array.isArray(product.variants)) {
      return (
        product.variants.find((variant) =>
          variant?._id?.toString() === variantId?.toString(),
        ) || null
      );
    }

    if (product.variants && product.variants._id?.toString() === variantId?.toString()) {
      return product.variants;
    }

    return null;
  };

  const getDisplayImage = (product, variant) => {
    const variantImage = variant?.images?.find((img) => img?.url)?.url;
    if (variantImage) return variantImage;
    if (product?.images?.length) return product.images[0].url;
    return null;
  };

  const itemsPricing = items.map((item) => {
    const { product, variant: variantId, price, quantity } = item;
    const variantDetail = item?.variantDetails || getVariantDetails(product, variantId);
    const displayPrice = price ?? variantDetail?.price ?? product?.price;
    const compareAt =
      variantDetail?.compareAtPrice?.amount ??
      product?.compareAtPrice?.amount ??
      null;
    const unitAmount = displayPrice?.amount ?? 0;
    const qty = quantity ?? 1;
    const hasDiscount = compareAt && compareAt > unitAmount;
    return { item, product, variantId, variantDetail, unitAmount, qty, compareAt, hasDiscount };
  });

  const totalDiscount = itemsPricing.reduce(
    (sum, p) => sum + (p.hasDiscount ? (p.compareAt - p.unitAmount) * p.qty : 0),
    0,
  );
  const subtotal = cart?.totalPrice ?? itemsPricing.reduce((s, p) => s + p.unitAmount * p.qty, 0);
  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const totalAmount = subtotal + deliveryCharge;


  const handleSaveAndContinue = () => {
    const selectedAddress = addresses?.find((address) => address._id === selectedId);
    navigate("/payment", { state: { selectedAddress } });
  };




  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100">
        <Stepper current={2} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* ═══════════ LEFT — Delivery address ═══════════ */}
          <div className="w-full lg:flex-1 border border-gray-100 rounded-lg p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Delivery Address</h1>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Select Address</h2>

            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <div className="flex flex-col gap-4 mb-4">
                {addresses?.map((address) => (
                  <label
                    key={address._id}
                    className={`flex items-start gap-3 border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${selectedId === address._id
                      ? "border-gray-900"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedId === address._id}
                      onChange={() => setSelectedId(address._id)}
                      className="mt-1 w-4 h-4 accent-black flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-gray-900 capitalize">
                            {address.addressType}
                          </h3>
                          {address.isDefault && (
                            <span className="text-[10px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{address.fullName}</p>
                        <p className="text-sm text-gray-500">
                          {address.houseNo}, {address.area}
                        </p>
                        <p className="text-sm text-gray-500">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-gray-500">
                          India&nbsp;&nbsp;|&nbsp;&nbsp;+91 {address.mobile}
                        </p>
                      </div>

                      <div className="flex flex-row sm:flex-col items-start sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAddress(address._id)}
                          className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Add new address toggle */}
            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg py-4 text-sm font-semibold text-gray-700 hover:border-gray-500 transition-colors mb-6"
              >
                <Plus size={16} />
                Add New Address
              </button>
            )}

            {/* Add new address form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-3 border border-gray-200 rounded-lg p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">New Address</h3>

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-500"
                />
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Mobile"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-500"
                  />
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-500"
                />
                <input
                  name="houseNo"
                  value={form.houseNo}
                  onChange={handleChange}
                  placeholder="House No / Flat"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-500"
                />
                <input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="Area"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-500"
                />
                <input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="Landmark"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-500"
                />
                <select
                  name="addressType"
                  value={form.addressType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-500"
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                </select>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-semibold hover:border-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Delivery instructions */}
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Delivery Instructions (Optional)
            </h2>
            <div className="relative mb-6">
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value.slice(0, 150))}
                maxLength={150}
                rows={3}
                placeholder="E.g. Leave it at the door if not available"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-500 resize-none"
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">
                {instructions.length}/150
              </span>
            </div>

            <button
              type="button"
              onClick={handleSaveAndContinue}
              disabled={!selectedId}
              className="w-full bg-black text-white py-4 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save and Continue
            </button>
          </div>

          {/* ═══════════ RIGHT — Order summary ═══════════ */}
          <div className="w-full lg:w-[360px] lg:flex-shrink-0 flex flex-col gap-4">
            <div className="border border-gray-100 rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                <span className="text-xs text-gray-400">{items.length} Items</span>
              </div>

              <div className="flex flex-col gap-4 mb-5">
                {itemsPricing.map(({ item, product, variantId, variantDetail, unitAmount, qty }) => {
                  const imageUrl = getDisplayImage(product, variantDetail);
                  const attributes = variantDetail?.attributes ?? {};
                  return (
                    <div key={`${product?._id}-${variantId}`} className="flex gap-3">
                      <div className="w-14 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product?.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                          {product?.title}
                        </h3>
                        {Object.keys(attributes).length > 0 && (
                          <p className="text-xs text-gray-500">
                            {Object.entries(attributes)
                              .map(([key, val]) => `${key[0].toUpperCase()}${key.slice(1)}: ${val}`)
                              .join("  |  ")}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">Qty: {qty}</p>
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
                  <span className="text-gray-500">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(subtotal + totalDiscount)}
                  </span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600 font-medium">Discount</span>
                    <span className="font-semibold text-green-600">
                      - {formatCurrency(totalDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Charges</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryCharge === 0 ? "Free" : formatCurrency(deliveryCharge)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-4" />

              <div className="flex justify-between items-baseline mb-1">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
              </div>
              {totalDiscount > 0 && (
                <p className="text-xs font-medium text-green-600">
                  You saved {formatCurrency(totalDiscount)} on this order
                </p>
              )}
            </div>

            <div className="border border-gray-100 rounded-lg p-4 flex items-center gap-3">
              <ShieldCheck size={20} className="text-gray-700 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Safe and Secure Payments. 100% Authentic Products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;