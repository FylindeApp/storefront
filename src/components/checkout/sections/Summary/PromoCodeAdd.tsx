import clsx from "clsx";
import React, { type FC } from "react";
import { Button } from "../../Button";
import { TextInput } from "../../TextInput";
import { useCheckoutAddPromoCodeMutation } from "../../graphql";
import { type Classes } from "../../lib/globalTypes";
import { useFormSubmit } from "../../hooks/useFormSubmit";
import { FormProvider } from "../../hooks/useForm/FormProvider";
import { useForm } from "../../hooks/useForm";

interface PromoCodeFormData {
	promoCode: string;
}

export const PromoCodeAdd: FC<Classes> = ({ className }) => {
	const [, checkoutAddPromoCode] = useCheckoutAddPromoCodeMutation();

	const onSubmit = useFormSubmit<PromoCodeFormData, typeof checkoutAddPromoCode>({
		scope: "checkoutAddPromoCode",
		onSubmit: checkoutAddPromoCode,
		parse: ({ promoCode, languageCode, checkoutId }) => ({
			promoCode,
			checkoutId,
			languageCode,
		}),
		onSuccess: ({ formHelpers: { resetForm } }) => resetForm(),
	});

	const form = useForm<PromoCodeFormData>({
		onSubmit,
		initialValues: { promoCode: "" },
	});
	const {
		values: { promoCode },
	} = form;

	const showApplyButton = promoCode.length > 0;

	return (
		<FormProvider form={form}>
			<div className={clsx("relative my-4", className)}>
				<TextInput required={false} name="promoCode" label="Add gift card or discount code" />
				{showApplyButton && (
					<Button
						className="absolute bottom-2.5 right-3"
						variant="tertiary"
						ariaLabel="apply"
						type="submit"
					>
						Apply
					</Button>

				)}
			</div>
		</FormProvider>
	);
};
