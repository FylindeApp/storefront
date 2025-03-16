import { addressAPI } from "./addressAPI";
import { AddressFormData } from "../components/checkout/AddressForm/address/types";

export class AddressService {
    static async fetchAddress(userId: string) {
        if (!userId) {
            throw new Error("User ID is required to fetch addresses");
        }
        try {
            return await addressAPI.fetchAddresses(userId); // ✅ Pass userId
        } catch (error) {
            console.error("AddressService.fetchAddress:", error);
            throw error;
        }
    }


    static async createAddress(addressData: AddressFormData) {
        try {
            return await addressAPI.createAddress(addressData);
        } catch (error) {
            console.error("AddressService.createAddress:", error);
            throw error;
        }
    }

    static async updateAddress(id: string, addressData: AddressFormData) {
        try {
            return await addressAPI.updateAddress(id, addressData);
        } catch (error) {
            console.error("AddressService.updateAddress:", error);
            throw error;
        }
    }

    static async deleteAddress(id: string) {
        try {
            return await addressAPI.deleteAddress(id);
        } catch (error) {
            console.error("AddressService.deleteAddress:", error);
            throw error;
        }
    }

    static async getAddressById(addressId: string) {
        try {
            return await addressAPI.getAddressById(addressId);
        } catch (error) {
            console.error("AddressService.getAddressById:", error);
            throw error;
        }
    }

    static async selectAddress(addressId: string) {
        try {
            return await addressAPI.getAddressById(addressId);
        } catch (error) {
            console.error("AddressService.selectAddress:", error);
            throw error;
        }
    }

    // ✅ New Function: Save Address (Uses `userId`)
    static async saveAddress(userId: string, addressData: AddressFormData) {
        try {
            return await addressAPI.saveAddress(userId, addressData);
        } catch (error) {
            console.error("AddressService.saveAddress:", error);
            throw error;
        }
    }
}
