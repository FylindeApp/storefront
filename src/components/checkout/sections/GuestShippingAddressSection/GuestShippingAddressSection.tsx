import React from "react";
import { AddressForm } from "../../AddressForm/address/AddressForm";
import { FormProvider } from "../../hooks/useForm/FormProvider";
import { useAvailableShippingCountries } from "../../hooks/useAvailableShippingCountries";
import { useGuestShippingAddressForm } from "../../../../components/checkout/sections/GuestShippingAddressSection/useGuestShippingAddressForm";

export const GuestShippingAddressSection = () => {
	const { availableShippingCountries } = useAvailableShippingCountries();

	const form = useGuestShippingAddressForm();

	const { handleChange, handleBlur } = form;

	return (
		<FormProvider form={form}>
			<AddressForm
				title="Shipping address"
				availableCountries={availableShippingCountries}
				fieldProps={{
					onChange: handleChange,
					onBlur: handleBlur,
				}}
			/>
		</FormProvider>
	);
};
