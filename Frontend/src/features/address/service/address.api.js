import axios from "axios";

const addressApiInstance = axios.create({
  baseURL: "/api/address",
  withCredentials: true,
});

// Add Address
export const addAddress = async (data) => {
  const response = await addressApiInstance.post("/add", data);
  return response.data;
};

// Get All Addresses
export const getAddresses = async () => {
  const response = await addressApiInstance.get("/");
  return response.data;
};

// Get Single Address
export const getAddress = async (addressId) => {
  const response = await addressApiInstance.get(`/${addressId}`);
  return response.data;
};

// Update Address
export const updateAddress = async ({ addressId, data }) => {
  const response = await addressApiInstance.put(`/${addressId}`, data);
  return response.data;
};

// Delete Address
export const deleteAddress = async (addressId) => {
  const response = await addressApiInstance.delete(`/${addressId}`);
  return response.data;
};