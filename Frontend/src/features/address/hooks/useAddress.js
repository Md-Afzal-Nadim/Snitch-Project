import {
  addAddress as addAddressApi,
  deleteAddress as deleteAddressApi,
  getAddresses,
  updateAddress as updateAddressApi,
  getAddress,
} from "../service/address.api.js";

import { useDispatch, useSelector } from "react-redux";

import {
  setLoading,
  setError,
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  clearAddresses,
} from "../state/address.slice.js";

export const useAddress = () => {
  const dispatch = useDispatch();

  const { addresses, loading, error } = useSelector(
    (state) => state.address
  );

  // Get All Addresses
  const fetchAddresses = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getAddresses();

      dispatch(setAddresses(data.addresses));
    } catch (error) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Add Address
  const createAddress = async (formData) => {
    try {
      dispatch(setLoading(true));

      const data = await addAddressApi(formData);

      dispatch(addAddress(data.address));
    } catch (error) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Update Address
  const editAddress = async (addressId, formData) => {
    try {
      dispatch(setLoading(true));

      const data = await updateAddressApi({
        addressId,
        data: formData,
      });

      dispatch(updateAddress(data.address));
    } catch (error) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Delete Address
  const removeAddress = async (addressId) => {
    try {
      dispatch(setLoading(true));

      await deleteAddressApi(addressId);

      dispatch(deleteAddress(addressId));
    } catch (error) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    createAddress,
    editAddress,
    removeAddress,
  };
};