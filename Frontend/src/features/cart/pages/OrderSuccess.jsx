import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

// Apni Redux state path ke according change karo
const selectOrder = (state) => state.cart



const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const order = useSelector(selectOrder)

  const queryParams = new URLSearchParams(location.search)
  const orderId = order?.orderId || queryParams.get('order_id') || 'N/A'

  useEffect(() => {
    if (!order && !queryParams.get('order_id')) {
      navigate('/', { replace: true })
    }
  }, [order])

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f3ee]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    )
  }

  const {
    deliveryDate,
    address = {},
    items = [],
    bagTotal = 0,
    shipping = 0,
    discount = 0,
    totalPaid = 0,
  } = order

  return (
    <>
      {/* ── Mobile View (< lg) ── */}
      <div className="block lg:hidden min-h-screen bg-[#f5f3ee] max-w-[430px] mx-auto pb-20">

        {/* Header */}
        <div className="relative flex items-center justify-center px-5 py-4 border-b border-[#e0ddd6]">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 text-gray-900 text-xl"
          >
            ←
          </button>
          <span className="text-xl font-black tracking-[3px] text-gray-900">SNITCH</span>
        </div>

        {/* Success banner */}
        <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
          <div className="w-16 h-16 rounded-full bg-[#c8e84a] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#3a5200]" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-[10px] font-bold tracking-[1.8px] uppercase text-[#6a7a10] mb-1.5">
            Order ID: #{orderId}
          </p>
          <h1 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">
            Order placed successfully!
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your order is on its way. Expect delivery by{' '}
            <span className="font-bold text-gray-900">{deliveryDate}</span>
          </p>
        </div>

        {/* Address */}
        <div className="mx-4 mb-5 bg-white border-[1.5px] border-gray-900 rounded-lg p-4 flex gap-3 relative overflow-hidden">
          <svg className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="1" />
            <path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <div>
            <p className="text-[10px] font-bold tracking-[1.8px] uppercase text-gray-900 mb-1.5">
              Delivery address
            </p>
            <p className="text-sm font-bold text-gray-900 mb-0.5">{address.name}</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {address.line1}<br />{address.line2}<br />{address.phone}
            </p>
          </div>
          <div className="absolute -right-2 -bottom-2 opacity-[0.06] pointer-events-none">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
              <path d="M9 21V12h6v9" fill="white" />
            </svg>
          </div>
        </div>

        {/* Items */}
        <div className="px-4">
          <h2 className="flex items-center gap-2 text-[11px] font-black tracking-[1.8px] uppercase text-gray-900 mb-3">
            <span className="w-1 h-4 bg-gray-900 rounded-sm inline-block" />
            Your items ({items.length})
          </h2>
          {items.map((item) => (
            <div key={item._id} className="bg-[#edeae2] rounded-lg flex overflow-hidden mb-2.5">
              <div className="w-24 h-24 flex-shrink-0 bg-[#d4d0c6]">
                {item.images
                  ? <img src={item.images} alt={item.fullname} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                }
              </div>
              <div className="px-4 py-3 flex flex-col justify-center flex-1 min-w-0">
                <p className="text-[13px] font-extrabold uppercase tracking-wide text-gray-900 mb-1 truncate">
                  {item.fullname}
                </p>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1.5">
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && ' | '}
                  {item.color && `Color: ${item.color}`}
                </p>
                <p className="text-lg font-extrabold text-gray-900">{formatINR(item.price)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dashed divider */}
        <div className="border-t-2 border-dashed border-gray-300 mx-4 my-5" />

        {/* Price summary */}
        <div className="px-4 pb-4">
          <div className="flex justify-between mb-2.5">
            <span className="text-[13px] uppercase tracking-wide text-gray-500">Bag total</span>
            <span className="text-[13px] text-gray-900">{formatINR(bagTotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2.5">
              <span className="text-[13px] uppercase tracking-wide text-gray-500">Discount</span>
              <span className="text-[13px] font-bold text-green-600">− {formatINR(discount)}</span>
            </div>
          )}
          <div className="flex justify-between mb-4">
            <span className="text-[13px] uppercase tracking-wide text-gray-500">Shipping</span>
            {shipping === 0
              ? <span className="text-[13px] font-bold text-green-600">FREE</span>
              : <span className="text-[13px] text-gray-900">{formatINR(shipping)}</span>
            }
          </div>
          <div className="flex justify-between items-center border-t-2 border-gray-900 pt-3">
            <span className="text-[14px] font-black uppercase tracking-wide text-gray-900">Total paid</span>
            <span className="text-2xl font-black text-gray-900">{formatINR(totalPaid)}</span>
          </div>
        </div>

        {/* Fixed bottom bar */}
        <div className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto flex h-[58px] z-10">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-900 text-[#f5f3ee] text-[11px] font-bold tracking-[1.5px] uppercase flex items-center justify-center gap-2"
          >
            Continue shopping
          </button>
          <button
            onClick={() => navigate(`/track-order?id=${orderId}`)}
            className="flex-1 bg-[#c8e84a] text-[#2a3a00] text-[11px] font-bold tracking-[1.5px] uppercase flex items-center justify-center gap-2"
          >
            Track order
          </button>
        </div>
      </div>

      {/* ── Dashboard View (lg+) ── */}
      <div className="hidden lg:block min-h-screen bg-gray-50 p-8 xl:p-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          ← Back to orders
        </button>

        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">

          {/* Left col: status + address + items */}
          <div className="col-span-2 space-y-5">

            {/* Status */}
            <div className="bg-white rounded-2xl border border-gray-200 px-8 py-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#c8e84a] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#3a5200]" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-[10px] font-bold tracking-[1.8px] uppercase text-[#6a7a10] mb-1.5">
                Order ID: #{orderId}
              </p>
              <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-2">
                Order placed successfully!
              </h1>
              <p className="text-sm text-gray-500">
                Expected delivery by{' '}
                <span className="font-bold text-gray-900">{deliveryDate}</span>
              </p>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-[10px] font-bold tracking-[1.8px] uppercase text-gray-900 mb-3">
                Delivery address
              </p>
              <p className="text-sm font-bold text-gray-900 mb-0.5">{address.name}</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {address.line1}, {address.line2}<br />{address.phone}
              </p>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-[11px] font-black tracking-[1.8px] uppercase text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-gray-900 rounded-sm inline-block" />
                Your items ({items.length})
              </h2>
              {items.map((item) => (
                <div key={item.id} className="bg-[#edeae2] rounded-lg flex overflow-hidden mb-3">
                  <div className="w-28 h-28 flex-shrink-0 bg-[#d4d0c6]">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                    }
                  </div>
                  <div className="px-5 py-4 flex flex-col justify-center flex-1 min-w-0">
                    <p className="text-sm font-extrabold uppercase tracking-wide text-gray-900 mb-1">{item.name}</p>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' | '}
                      {item.color && `Color: ${item.color}`}
                    </p>
                    <p className="text-xl font-extrabold text-gray-900">{formatINR(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right col: price summary sticky */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8">
              <h2 className="text-[11px] font-black tracking-[1.8px] uppercase text-gray-900 mb-5">
                Price summary
              </h2>
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-500">Bag total</span>
                <span className="text-sm text-gray-900">{formatINR(bagTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-3">
                  <span className="text-sm text-gray-500">Discount</span>
                  <span className="text-sm font-bold text-green-600">− {formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between mb-5">
                <span className="text-sm text-gray-500">Shipping</span>
                {shipping === 0
                  ? <span className="text-sm font-bold text-green-600">FREE</span>
                  : <span className="text-sm text-gray-900">{formatINR(shipping)}</span>
                }
              </div>
              <div className="flex justify-between items-center border-t-2 border-gray-900 pt-4 mb-6">
                <span className="text-sm font-black uppercase tracking-wide text-gray-900">Total paid</span>
                <span className="text-2xl font-black text-gray-900">{formatINR(totalPaid)}</span>
              </div>
              <button
                onClick={() => navigate(`/track-order?id=${orderId}`)}
                className="w-full bg-[#c8e84a] text-[#2a3a00] text-xs font-bold tracking-[1.5px] uppercase h-12 rounded-lg flex items-center justify-center gap-2 hover:brightness-95 transition-all mb-3"
              >
                Track order
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-900 text-white text-xs font-bold tracking-[1.5px] uppercase h-12 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
              >
                Continue shopping
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default OrderSuccess