import { useMemo, useState } from "react";
import { object, string } from "yup";
import { AddressField } from "./types";
import { useErrorMessages } from "../../hooks/useErrorMessages";
import { CountryCode } from "../../graphql";
import { useAddressFormUtils } from "./useAddressFormUtils";

export const useAddressFormSchema = (initialCountryCode?: CountryCode) => {
	const { errorMessages } = useErrorMessages();
	const [countryCode, setCountryCode] = useState(initialCountryCode);
	const { requiredFields, allowedFields = [] } = useAddressFormUtils(countryCode);


	const validationSchema = useMemo(() => {
		return object().shape(
			allowedFields.reduce((schema, field) => {
				schema[field] = requiredFields.includes(field) ? string().required(errorMessages.required) : string();
				return schema;
			}, {} as Record<AddressField, any>)
		);
	}, [allowedFields, requiredFields, errorMessages.required]);

	return { validationSchema, setCountryCode };
};
