
import { RootState } from "..";

export const selectAddress = (state: RootState) => state.address.addresses;
export const selectAddressLoading = (state: RootState) => state.address.loading;
export const selectAddressError = (state: RootState) => state.address.error;
