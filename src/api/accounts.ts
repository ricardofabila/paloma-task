import axiosInstance from './axiosInstance';
import {AccountResponse} from "../types/types.ts";

export const fetchAccounts = async (): Promise<AccountResponse> => {
    try {
        const response = await axiosInstance.get<AccountResponse>("/accounts");
        return response.data;
    } catch (error) {
        return {
            data: null,
            error: "Failed to fetch accounts",
        };
    }
};