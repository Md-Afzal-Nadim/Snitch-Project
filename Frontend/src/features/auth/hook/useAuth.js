import { setUser, setLoading, setError } from "../state/auth.slice";
import { register, login } from "../service/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister(email, contact, password, fullname, isSeller = false) {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await register(email, contact, password, fullname, isSeller);
      dispatch(setUser(data.user ?? data));
      return data;
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || "Registration failed"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await login({ email, password });
      dispatch(setUser(data.user ?? data));
      return data;
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || "Login failed"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin };
};