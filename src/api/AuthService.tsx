import axios, { AxiosError } from "axios";
import type { Login } from "../interfaces/Login";
import type { Register } from "../interfaces/Register";
import type { ApiResponse } from "../interfaces/ApiResponse";
import type { User } from "../interfaces/User";

const API_URL = import.meta.env.VITE_API_URL;

export const loginService = async (login: Login) => {
  try {
    console.log(API_URL)
    const { data } = await axios.post<ApiResponse<User>>(`${API_URL}/api/auth/login`, login);
    if (!data.success) {
      throw data;
    }
    return data;
  } catch (error) {
    // Tipamos error como AxiosError<ApiResponse>
    const err = error as AxiosError<ApiResponse<null>>;

    throw {
      success: false,
      status: err.response?.status ?? 500,
      message: err.response?.data?.message ?? "Error en login",
      details: err.response?.data?.details,
    } as ApiResponse<null>;
  }
}

export const registerService = async (dataRegister: Register) => {
  try {
    const { data } = await axios.post<ApiResponse<User>>(`${API_URL}/api/auth/register`, dataRegister);
    return data;
  } catch (error) {
    // Tipamos error como AxiosError<ApiResponse>
    const err = error as AxiosError<ApiResponse<null>>;

    throw {
      success: false,
      status: err.response?.status ?? 500,
      message: err.response?.data?.message ?? "Error en registro",
      details: err.response?.data?.details,
    } as ApiResponse<null>;
  }
};

