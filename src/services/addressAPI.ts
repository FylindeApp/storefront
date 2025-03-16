import axios from "axios";
import { AddressFormData } from "../components/checkout/AddressForm/address/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const addressAPI = {
    fetchAddresses: async (userId: string) => {
        if (!userId) {
            throw new Error("User ID is required to fetch addresses");
        }
        const response = await axios.get(`${API_BASE_URL}/addresses`, {
            params: { userId }, // ✅ Pass userId as a query parameter
        });
        return response.data;
    },


    createAddress: async (addressData: AddressFormData) => {
        const response = await axios.post(`${API_BASE_URL}/addresses`, addressData);
        return response.data;
    },

    updateAddress: async (id: string, addressData: AddressFormData) => {
        const response = await axios.put(`${API_BASE_URL}/addresses/${id}`, addressData);
        return response.data;
    },

    deleteAddress: async (id: string) => {
        await axios.delete(`${API_BASE_URL}/addresses/${id}`);
    },

    getAddressById: async (addressId: string) => {
        const response = await axios.get(`${API_BASE_URL}/addresses/${addressId}`);
        return response.data;
    },

    // ✅ New Function: Save Address (Creates or Updates Based on `userId`)
    saveAddress: async (userId: string, addressData: AddressFormData) => {
        const response = await axios.post(`${API_BASE_URL}/users/${userId}/addresses`, addressData);
        return response.data;
    }
};
