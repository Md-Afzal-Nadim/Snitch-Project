import express from "express";
import {
  addAddressController,
  getUserAddressesController,
  getSingleAddressController,
  updateAddressController,
  deleteAddressController,
} from "../controllers/address.controllers.js";

import {  authenticateUser} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", authenticateUser, addAddressController);

router.get("/", authenticateUser, getUserAddressesController);

router.get("/:addressId", authenticateUser, getSingleAddressController);

router.put("/:addressId", authenticateUser, updateAddressController);

router.delete("/:addressId", authenticateUser, deleteAddressController);

export default router;