import { addItem, getCart, incrementCartItemApi, decrementCartItemApi, createCartOrder, verifyCartOrder } from '../service/cart.api';
import { useDispatch } from 'react-redux';
import { setCart,  incrementCartItem, decrementCartItem } from '../state/cart.slice';



export const useCart = () => {

  const dispatch = useDispatch();
  async function handleAddItem({ productId, variantId }) {
    const data = await addItem({ productId, variantId })
    // अगर प्रोडक्ट सफलतापूर्वक ऐड हो गया है, तो कार्ट को फिर से लोड करें
    if (data.success) {
      await handleGetCart();
    }
    return data;
  }

  async function handleGetCart() {
    const data = await getCart();
    dispatch(setCart(data.cart));
  }

  async function handleIncrementCartItem({ productId, variantId }) {
    const data = await incrementCartItemApi({ productId, variantId });
    dispatch(incrementCartItem({ productId, variantId }));
  }

  async function handleDecrementCartItem({ productId, variantId }) {
    const data = await decrementCartItemApi({ productId, variantId });
    dispatch(decrementCartItem({ productId, variantId }));
  }

     async function handleCreateCartOrder() {
    const data = await createCartOrder();
    return data.order;
  }

  async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    return data.success;
  }

  return { handleAddItem, handleGetCart, handleIncrementCartItem , handleDecrementCartItem  , handleCreateCartOrder, handleVerifyCartOrder };
}