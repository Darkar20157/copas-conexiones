import axios from "axios";
import type { Login } from "../interfaces/Login";
import type { AuthResponse } from "../interfaces/AuthResponse";
import type { Register } from "../interfaces/Register";

const API_URL = 'http://localhost:3000/api/auth';

export const loginService = async (login: Login) => {
  try {
    const reponse = await axios.post<AuthResponse>(`${API_URL}/login`, login);
    return reponse.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const registerService = async (data: Register) => {
  try {
    const res = await axios.post(`${API_URL}/register`, data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error en el registro");
  }
};

