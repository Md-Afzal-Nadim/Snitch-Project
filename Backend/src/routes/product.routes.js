import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, getSellerProducts, getAllProducts, getProductDetails } from "../controllers/product.controller.js";
import { createProductValidator } from "../validator/product.validator.js";
import { addProductVariant } from "../controllers/product.controller.js";

import multer from "multer";



const router = express.Router();



const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})



/**
 * @route POST /api/products
 * @description Create a new product
 * @access private (only seller can create a product)
 */
router.post("/", authenticateSeller, upload.array("images", 7),createProductValidator, createProduct);


/**
 * @route GET /api/products/seller
 * @description Get all products
 * @access private (only seller can get all products)
 */
router.get("/seller", authenticateSeller, getSellerProducts);



/**
 * @route GET /api/products
 * @description Get all products
 * @access public
 */
router.get("/",getAllProducts)



/**
 * @route GET /api/products/detail/:id
 * @description Get a product by id
 * @access public
 */
router.get("/detail/:id", getProductDetails)



/**
 * @route POST /api/products/:productId/variants
 * @description Add variants to a product
 * @access private (only seller can add variants to a product)
 */
router.post("/:productId/variants", authenticateSeller, upload.array("images", 7), addProductVariant);



export default router;