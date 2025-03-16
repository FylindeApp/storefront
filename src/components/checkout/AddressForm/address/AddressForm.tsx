import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddressFormData } from "./types";
import { fetchAddress, saveAddress } from "../../../../store/slices/addressSlice";
import { selectAddress, selectAddressLoading } from "../../../../store/selectors/addressSelectors";
import { AddressFormContainer } from "./AddressForm.styles";
import { Title } from "../../Title";
import { TextInput } from "../../TextInput";
import { Select } from "../../Select";
import { Button } from "../../Button";
import { useForm, Controller } from "react-hook-form";
import { CountryCode } from "../../graphql";
import { AppDispatch } from "../../../../store"; // Ensure this is correct
import { AddressData } from "../../../../types/address";
import { useMemo } from "react";


// ✅ Define AddressFormProps
export interface AddressFormProps {
	userId?: string;
	title: string;
	availableCountries?: CountryCode[];
	children?: React.ReactNode; // ✅ Fix: Allow children inside AddressForm
	fieldProps?: {  // ✅ Ensure it's optional if it may not always be used
		onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
		onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	};
}

const AddressForm: FC<AddressFormProps> = ({ userId, fieldProps = {} }) => {
	const dispatch = useDispatch<AppDispatch>(); // ✅ Typed dispatch
	const address = useSelector(selectAddress);
	const loading = useSelector(selectAddressLoading);
	const { control, register, handleSubmit, setValue } = useForm<AddressFormData>();

	const stateOptions = [
		{ label: "New York", value: "NY" },
		{ label: "California", value: "CA" },
		{ label: "Texas", value: "TX" },
		{ label: "Florida", value: "FL" },
		{ label: "Ontario", value: "ON" },
		{ label: "British Columbia", value: "BC" },
		{ label: "Quebec", value: "QC" },
	];
	const addressFieldMapping = useMemo(
		() => ({
			fullName: "firstName",
			email: undefined,
			phoneNumber: "phone",
			postalCode: "postalCode",
			street: "streetAddress1",
			city: "city",
			state: "countryArea",
			country: "countryCode",
			addressLine1: "streetAddress1",
			addressLine2: "streetAddress2",
			is_primary: undefined,
		}),
		[]
	);



	useEffect(() => {
		if (userId) {
			dispatch(fetchAddress(userId)); // ✅ Ensures only valid `userId` is passed
		}
	}, [dispatch, userId]);



	useEffect(() => {
		if (address) {
			Object.entries(address).forEach(([key, value]) => {
				const typedKey = key as keyof AddressData; // Ensure type safety
				const formKey = addressFieldMapping[typedKey];

				if (formKey) {
					setValue(formKey as keyof AddressFormData, value as any);
				}
			});
		}
	}, [address, setValue, addressFieldMapping]);







	const onSubmit = (data: AddressFormData) => {
		if (!userId) {
			console.error("Error: userId is undefined!");
			return;
		}
		dispatch(saveAddress({ userId, address: data }));
	};


	return (
		<AddressFormContainer>
			<Title>Shipping Address</Title>
			<input type="text" onChange={fieldProps.onChange} onBlur={fieldProps.onBlur} />
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextInput {...register("firstName")} label="First Name" required />
				<TextInput {...register("lastName")} label="Last Name" required />
				<TextInput {...register("streetAddress1")} label="Street Address" required />
				<TextInput {...register("city")} label="City" required />

				<Controller
					name="countryArea"
					control={control}
					render={({ field }) => (
						<Select {...field} label="State / Province" options={stateOptions} />
					)}
				/>

				<TextInput {...register("postalCode")} label="Zip Code" required />

				<Button type="submit" disabled={loading}>
					{loading ? "Saving..." : "Save Address"}
				</Button>
			</form>
		</AddressFormContainer>
	);
};

export { AddressForm }; // ✅ Export Both
export default AddressForm; // ✅ Default Export
