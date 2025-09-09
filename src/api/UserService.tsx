import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../interfaces/ApiResponse";
import type { User } from "../interfaces/User";

const API_URL = import.meta.env.VITE_API_URL;

export const getUserService = async (userId: number) => {
    try {
        const { data } = await axios.get<ApiResponse<User>>(`${API_URL}/api/users/${userId}`);
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
            message: err.response?.data?.message ?? "Error en obtener los datos del usuario",
            details: err.response?.data?.details,
        } as ApiResponse<null>;
    }
}