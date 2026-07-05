import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    totalPrice: null,
    currency: null,
    items: [],
    order: null, // holds a snapshot of the last placed order: { orderId, orderDate, address, items, bagTotal, shipping, discount, totalPaid, paymentStatus }
    orders: [], // recent orders list
  },

  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
      state.currency = action.payload.currency;
    },

    addItem: (state, action) => {
      state.items.push(action.payload);
    },

    incrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        if (item.product._id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
    },

    decrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        if (item.product._id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          return item;
        }
      });
    },

    // Call this right after Razorpay verification succeeds.
    // Captures the exact placement time via orderDate, and stores a full
    // snapshot of what was ordered so OrderSuccess.jsx has everything it needs.
    setOrderSuccess: (state, action) => {
      const { orderId, address, items, bagTotal, shipping, discount, totalPaid, paymentStatus } =
        action.payload;

      const orderSnapshot = {
        orderId,
        orderDate: new Date().toISOString(),
        address,
        items,
        bagTotal,
        shipping,
        discount,
        totalPaid,
        paymentStatus: paymentStatus || "paid",
      };

      state.order = orderSnapshot;

      // prepend to orders list so Orders UI updates without refresh
      state.orders = [orderSnapshot, ...(state.orders || [])];

      // Order placed — clear the live cart
      state.items = [];
      state.totalPrice = null;
    },

    clearOrder: (state) => {
      state.order = null;
    },
  },
});

export const {
  setCart,
  addItem,
  incrementCartItem,
  decrementCartItem,
  setOrderSuccess,
  clearOrder,
} = cartSlice.actions;

export default cartSlice.reducer;