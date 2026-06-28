import addressModel from "../models/address.model.js";

// =============================
// Add Address
// =============================
export const addAddressController = async (req, res) => {
  try {
    const userId = req.user.id; // auth middleware se

    const {
      fullName,
      mobile,
      pincode,
      state,
      city,
      houseNo,
      area,
      landmark,
      addressType,
    } = req.body;

    const address = await addressModel.create({
      userId,
      fullName,
      mobile,
      pincode,
      state,
      city,
      houseNo,
      area,
      landmark,
      addressType,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Addresses of User
// =============================
export const getUserAddressesController = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await addressModel.find({ userId });

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Address
// =============================
export const getSingleAddressController = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const address = await addressModel.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Address
// =============================
export const updateAddressController = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const updatedAddress = await addressModel.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Address
// =============================
export const deleteAddressController = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const deletedAddress = await addressModel.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};