/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { type AddressFormData } from "../../AddressForm/address/types";
import { getEmptyAddressFormData, getAddressInputData } from "../../AddressForm/address/utils";
import { type ChangeHandler, useForm } from "../../hooks/useForm";
import { useFormSubmit } from "../../hooks/useFormSubmit";
import { AddressFormActions } from "../../ManualSaveAddressForm";
import { useAddressFormSchema } from "../../AddressForm/address/useAddressFormSchema";
import { AddressForm, type AddressFormProps } from "../../AddressForm/address/AddressForm";
import { type AddressFragment, type CountryCode, useUserAddressCreateMutation } from "../../../../components/checkout/graphql";
import { FormProvider } from "../../hooks/useForm/FormProvider";

export interface AddressCreateFormProps extends Pick<AddressFormProps, "availableCountries"> {
	onSuccess: (address: AddressFragment) => void;
	onClose: () => void;
}


export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({
	onSuccess,
	onClose,
	availableCountries,
}) => {
	const [, userAddressCreate] = useUserAddressCreateMutation();
	const { setCountryCode, validationSchema } = useAddressFormSchema();

	const onSubmit = useFormSubmit<AddressFormData, typeof userAddressCreate>({
		scope: "userAddressCreate",
		onSubmit: userAddressCreate,
		parse: (addressFormData) => ({ address: getAddressInputData(addressFormData) }),
		onSuccess: ({ data }) => {
			onSuccess(data.address as AddressFragment);
			onClose();
		},
	});

	const form = useForm<AddressFormData>({
		validationSchema,
		initialValues: getEmptyAddressFormData(),
		onSubmit,
	});

	const { handleSubmit, isSubmitting, handleChange } = form;

	const onChange: ChangeHandler = (event) => {
		const { name, value } = event.target;

		if (name === "countryCode") {
			setCountryCode(value as CountryCode);
		}

		handleChange(event);
	};

	return (
		<FormProvider form={{ ...form, handleChange: onChange }}>
			<AddressForm title="Create address" availableCountries={availableCountries}>
				<AddressFormActions onSubmit={handleSubmit} loading={isSubmitting} onCancel={onClose} />
			</AddressForm>
		</FormProvider>
	);

};
