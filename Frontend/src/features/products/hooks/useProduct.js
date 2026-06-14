import { createProduct, getSellerProducts, getAllProducts, getProductById } from "../service/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts, setLoading } from "../state/product.slice";



export const useProduct = () => {

  const dispatch = useDispatch();

  async function handleCreateProduct(formData) {
    const data = await createProduct(formData);
    return data.product
  }

  async function handleGetSellerProducts() {

    const data = await getSellerProducts();
    dispatch(setSellerProducts(data.products));
    return data.products;
  }

  async function handleGetAllProducts() {
    try {
      dispatch(setLoading(true));
      const data = await getAllProducts();
      dispatch(setProducts(data.products || []));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetProductById(productId) {
    const data = await getProductById(productId);
    return data.product;
  }

  return { handleCreateProduct, handleGetSellerProducts, handleGetAllProducts, handleGetProductById };
}