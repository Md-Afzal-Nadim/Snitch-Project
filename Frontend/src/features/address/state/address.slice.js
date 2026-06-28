
  import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",

  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },

    addAddress: (state, action) => {
      state.addresses.unshift(action.payload);
    },

    updateAddress: (state, action) => {
      state.addresses = state.addresses.map((address) =>
        address._id === action.payload._id
          ? action.payload
          : address
      );
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (address) => address._id !== action.payload
      );
    },

    clearAddresses: (state) => {
      state.addresses = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  clearAddresses,
} = addressSlice.actions;

export default addressSlice.reducer;