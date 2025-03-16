import { createAction } from "@reduxjs/toolkit";

export const deleteAddress = createAction<string>("address/deleteAddress");
export const saveAddress = createAction("address/saveAddress");
