// api/RouletteService.ts
import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../interfaces/ApiResponse";
import type { Roulette } from "../interfaces/Roulette";
import type { Page } from "../interfaces/Page";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Listar opciones de la ruleta
export const getRoulettes = async (
    page = 0,
    limit = 10
): Promise<ApiResponse<Page<Roulette>>> => {
    try {
        const { data } = await axios.get<ApiResponse<Page<Roulette>>>(
            `${API_URL}/api/roulette`,
            { params: { page, limit } }
        );
        if (!data.success) throw data;
        return data;
    } catch (error) {
        const err = error as AxiosError<ApiResponse<null>>;
        throw {
            success: false,
            status: err.response?.status ?? 500,
            message:
                err.response?.data?.message ??
                "Error en obtener las opciones de la ruleta",
            details: err.response?.data?.details,
        } as ApiResponse<null>;
    }
};

// ✅ Obtener opción por ID
export const getRouletteById = async (
    id: number
): Promise<ApiResponse<Roulette>> => {
    try {
        const { data } = await axios.get<ApiResponse<Roulette>>(
            `${API_URL}/api/roulette/${id}`
        );
        if (!data.success) throw data;
        return data;
    } catch (error) {
        const err = error as AxiosError<ApiResponse<null>>;
        throw {
            success: false,
            status: err.response?.status ?? 500,
            message:
                err.response?.data?.message ??
                "Error en obtener la opción de la ruleta",
            details: err.response?.data?.details,
        } as ApiResponse<null>;
    }
};

// ✅ Crear nueva opción
export const createRoulette = async (
    option: Pick<Roulette, "name" | "description">
): Promise<ApiResponse<Roulette>> => {
    try {
        const { data } = await axios.post<ApiResponse<Roulette>>(
            `${API_URL}/api/roulette`,
            option
        );
        if (!data.success) throw data;
        return data;
    } catch (error) {
        const err = error as AxiosError<ApiResponse<null>>;
        throw {
            success: false,
            status: err.response?.status ?? 500,
            message:
                err.response?.data?.message ??
                "Error en crear la opción de la ruleta",
            details: err.response?.data?.details,
        } as ApiResponse<null>;
    }
};

// ✅ Actualizar opción
export const updateRoulette = async (
    id: number,
    option: Partial<Roulette>
): Promise<ApiResponse<Roulette>> => {
    try {
        const { data } = await axios.put<ApiResponse<Roulette>>(
            `${API_URL}/api/roulette/${id}`,
            option
        );
        if (!data.success) throw data;
        return data;
    } catch (error) {
        const err = error as AxiosError<ApiResponse<null>>;
        throw {
            success: false,
            status: err.response?.status ?? 500,
            message:
                err.response?.data?.message ??
                "Error en actualizar la opción de la ruleta",
            details: err.response?.data?.details,
        } as ApiResponse<null>;
    }
};

// ✅ Eliminar opción
export const deleteRoulette = async (
    id: number
): Promise<ApiResponse<null>> => {
    try {
        const { data } = await axios.delete<ApiResponse<null>>(
            `${API_URL}/api/roulette/${id}`
        );
        if (!data.success) throw data;
        return data;
    } catch (error) {
        const err = error as AxiosError<ApiResponse<null>>;
        throw {
            success: false,
            status: err.response?.status ?? 500,
            message:
                err.response?.data?.message ??
                "Error en eliminar la opción de la ruleta",
            details: err.response?.data?.details,
        } as ApiResponse<null>;
    }
};
