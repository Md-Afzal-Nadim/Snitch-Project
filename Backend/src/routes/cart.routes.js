import express from "express"
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart, validateIncrementCartItemQuantity, validateDecrementCartItemQuantity } from "../validator/cart.validator.js";
import { addToCart, getCart, incrementCartItemQuantity, decrementCartItemQuantity } from "../controllers/cart.controller.js";




const router = express.Router();


/**
 * @route POST /api/cart/add/:productId/:variantId
 * @description Add a product to the cart
 * @access private
 * @argument productId - ID of the product to be added to the cart
 * @argument variantId - ID of the variant of the product to be added to the cart
 * @argument quantity - Quantity of the product to be added to (optional, default is 1)
 */
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart);



/**
 * @route GET /api/cart
 * @description Get the cart of the authenticated user
 * @access private
 */
router.get("/", authenticateUser, getCart);




/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @description Update item quantity in the cart
 * @access private
 * @argument productId - ID of the product to update
 * @argument variantId - ID of the variant to update
 * @argument quantity - New quantity of the item ( required)
 */
router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, incrementCartItemQuantity);




/**
 * @route PATCH /api/cart/quantity/decrement/:productId/:variantId
 * @description Update item quantity in the cart
 * @access private
 * @argument productId - ID of the product to update
 * @argument variantId - ID of the variant to update
 * @argument quantity - New quantity of the item ( required)
 */
router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, validateDecrementCartItemQuantity, decrementCartItemQuantity);








export default router