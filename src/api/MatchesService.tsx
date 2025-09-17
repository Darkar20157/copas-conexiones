import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../interfaces/ApiResponse";
import type { Page } from "../interfaces/Page";
import type { Match } from "../interfaces/Match";
import type { RevealMatch } from "../interfaces/RevealMatch";

const API_URL = import.meta.env.VITE_API_URL;

export const getMatches = async (page: number, limit: number, viewed?: boolean) => {
    try {
        const { data } = await axios.get<ApiResponse<Page<Match>>>(`${API_URL}/api/matches`, {
            params: { page, limit, viewed },
        });
        if (!data.success) throw data;
        return data;
    } catch (error) {
        console.error(error);
        const err = error as AxiosError<ApiResponse<null>>;
        throw {
            success: false,
            status: err.response?.status ?? 500,
            message: err.response?.data?.message ?? "Error en obtener los matches",
            details: err.response?.data?.details,
        } as ApiResponse<null>;
    }
};

export const updateMatchView = async (matchId: number, viewAdmin: boolean) => {
    const res = await axios.patch(`${API_URL}/api/matches/${matchId}`, {
        view_admin: viewAdmin,
    });
    return res.data;
};

export const getUserMatches = async (
    userId: number,
    page: number,
    limit: number
) => {
    try {
        const { data } = await axios.get<ApiResponse<Page<RevealMatch>>>(
            `${API_URL}/api/matches/user/${userId}`,
            {
                params: { page, limit },
            }
        );

        if (!data.success) throw data;
        return data;
    } catch (error) {
        console.error(error);
        const err = error as AxiosError<ApiResponse<null>>;
        throw {
            success: false,
            status: err.response?.status ?? 500,
            message: err.response?.data?.message ?? "Error en obtener los matches",
            details: err.response?.data?.details,
        } as ApiResponse<null>;
    }
};
