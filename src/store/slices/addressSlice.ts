import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AddressService } from "../../services/addressService"; // ✅ Ensure correct path
import { AddressFormData } from "../../components/checkout/AddressForm/address/types";
import { AddressFragment } from "../../components/checkout/graphql";
import { Address } from "../../types/address";


// Define the shape of the state
interface AddressState {
    addresses: AddressFragment[];
    selectedAddress?: AddressFragment | null;
    loading: boolean;
    error: string | null;
    defaultAddressId?: string | null; // Default address for quick selection

}

// ✅ Initial state
const initialState: AddressState = {
    addresses: [],
    selectedAddress: null,
    loading: false,
    error: null,
    defaultAddressId: null,
};

// ✅ Async thunk to fetch all addresses
export const fetchAddress = createAsyncThunk(
    "address/fetchAll",
    async (userId: string, { rejectWithValue }) => {
        if (!userId) {
            return rejectWithValue("User ID is required");
        }
        return await AddressService.fetchAddress(userId);
    }
);

// Add a new address
export const saveAddress = createAsyncThunk(
    "address/saveAddress",
    async ({ userId, address }: { userId: string; address: AddressFormData }, { rejectWithValue }) => {
        try {
            return await AddressService.saveAddress(userId, address);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to save address");
        }
    }
);



// ✅ Async thunk to add a new address
export const addNewAddress = createAsyncThunk("address/add", async (addressData: AddressFormData, { rejectWithValue }) => {
    try {
        return await AddressService.createAddress(addressData);
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to create address");
    }
});

// ✅ Async thunk to update an address
export const modifyAddress = createAsyncThunk(
    "address/update",
    async ({ id, addressData }: { id: string; addressData: AddressFormData }, { rejectWithValue }) => {
        try {
            return await AddressService.updateAddress(id, addressData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to update address");
        }
    }
);

// ✅ Async thunk to delete an address
export const removeAddress = createAsyncThunk("address/delete", async (id: string, { rejectWithValue }) => {
    try {
        await AddressService.deleteAddress(id);
        return id; // Return the deleted ID to update state
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to delete address");
    }
});

// ✅ Async thunk to fetch and select an address
export const selectAddress = createAsyncThunk("address/select", async (addressId: string, { rejectWithValue }) => {
    try {
        return await AddressService.selectAddress(addressId);
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to select address");
    }
});

const mapAddressToFragment = (address: Address): AddressFragment => ({
    __typename: "Address",
    id: address.id || "",
    firstName: address.firstName,
    lastName: address.lastName,
    phone: address.phoneNumber, // ✅ Keep phone instead of email
    streetAddress1: address.addressLine1,
    streetAddress2: address.addressLine2 || "",
    city: address.city,
    cityArea: "",
    companyName: "",
    countryArea: "",
    postalCode: address.postalCode,
    country: { __typename: "CountryDisplay", country: address.country, code: "" }
});




// ✅ Redux Slice
const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        clearAddressState(state) {
            state.selectedAddress = null;
            state.error = null;
        },
        setSelectedAddress: (state, action: PayloadAction<AddressFragment>) => {
            state.selectedAddress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addNewAddress.fulfilled, (state, action) => {
                state.addresses.push(action.payload);
            })

            .addCase(modifyAddress.fulfilled, (state, action) => {
                const index = state.addresses.findIndex((addr) => addr.id === action.payload.id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
            })

            .addCase(removeAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter((addr) => addr.id !== action.payload);
            })

            .addCase(selectAddress.fulfilled, (state, action) => {
                state.selectedAddress = action.payload;
            })
            .addCase(saveAddress.fulfilled, (state, action: PayloadAction<AddressFragment>) => {
                state.addresses.push(action.payload);

                // ✅ Instead of 'is_default', use 'defaultAddressId'
                if (state.defaultAddressId === action.payload.id) {
                    state.defaultAddressId = action.payload.id;
                }
            });

    },
});

// ✅ Export actions and reducer
export const { clearAddressState, setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
