import { createSlice } from "@reduxjs/toolkit";
import { decrementCartItemApi } from "../service/cart.api";



const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },

  reducers: {
    setItems:(state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    incrementCartItem: async (state, action) => {
      const { productId, variantId } = action.payload;
    
      state.items = state.items.map(item => {
        if (item.product_id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity + 1 };
        }else {
        return item;
      }
      })
    },
    decrementCartItem: async (state, action) => {
      const { productId, variantId } = action.payload;
    
      state.items = state.items.map(item => {
        if (item.product_id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity - 1 };
        }else {
        return item;
      }
      })
    },

  }

})

export const { setItems, addItem, incrementCartItem, decrementCartItem } = cartSlice.actions

export default cartSlice.reducer