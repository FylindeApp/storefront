import { omit } from "lodash-es";
import { useMemo } from "react";
import {
	getAddressFormDataFromAddress,
	getAddressInputData,
	getAddressValidationRulesVariables,
} from "../../AddressForm/address/utils";
import { useCheckoutBillingAddressUpdateMutation } from "../../../../components/checkout/graphql";
import { useFormSubmit } from "../../hooks/useFormSubmit";
import { useCheckoutFormValidationTrigger } from "../../hooks/useCheckoutFormValidationTrigger";
import { useCheckout } from "../../hooks/useCheckout";
import { useAddressFormSchema } from "../../AddressForm/address/useAddressFormSchema";
import {
	type AutoSaveAddressFormData,
	useAutoSaveAddressForm,
} from "../../hooks/useAutoSaveAddressForm";
import { useSetCheckoutFormValidationState } from "../../hooks/useSetCheckoutFormValidationState";
import { useCheckoutUpdateStateActions } from "../../state/updateStateStore";

interface GuestBillingAddressFormProps {
	skipValidation: boolean;
}

export const useGuestBillingAddressForm = ({ skipValidation }: GuestBillingAddressFormProps) => {
	const {
		checkout: { billingAddress },
	} = useCheckout();
	const validationSchema = useAddressFormSchema();
	const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();
	const { setCheckoutFormValidationState } = useSetCheckoutFormValidationState("billingAddress");
	const { setChangingBillingCountry } = useCheckoutUpdateStateActions();

	const onSubmit = useFormSubmit<AutoSaveAddressFormData, typeof checkoutBillingAddressUpdate>(
		useMemo(
			() => ({
				scope: "checkoutBillingUpdate",
				onSubmit: checkoutBillingAddressUpdate,
				onStart: ({ formData }) => {
					if (formData.countryCode !== billingAddress?.country.code) {
						setChangingBillingCountry(true);
					}
				},
				parse: ({ languageCode, checkoutId, ...rest }) => ({
					languageCode,
					checkoutId,
					billingAddress: getAddressInputData(omit(rest, ["channel"])),
					validationRules: getAddressValidationRulesVariables({ autoSave: true }),
				}),
				onSuccess: ({ data, formHelpers }) => {
					void setCheckoutFormValidationState({
						...formHelpers,
						values: getAddressFormDataFromAddress(data.checkout?.billingAddress),
					});
				},
				onFinished: () => {
					setChangingBillingCountry(false);
				},
			}),
			[
				billingAddress?.country.code,
				checkoutBillingAddressUpdate,
				setChangingBillingCountry,
				setCheckoutFormValidationState,
			],
		),
	);

	const form = useAutoSaveAddressForm({
		onSubmit,
		initialValues: getAddressFormDataFromAddress(billingAddress),
		validationSchema,
		scope: "checkoutBillingUpdate",
	});

	useCheckoutFormValidationTrigger({
		form,
		scope: "billingAddress",
		skip: skipValidation,
	});

	return form;
};
