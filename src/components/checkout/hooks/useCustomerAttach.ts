import { useEffect, useMemo } from "react";
import { useCheckoutCustomerAttachMutation } from "../../../components/checkout/graphql";
import { useSubmit } from "../hooks/useSubmit/useSubmit";
import { useUser } from "../hooks/useUser";
import { useCheckout } from "../hooks/useCheckout";

export const useCustomerAttach = () => {
	const { checkout, fetching: fetchingCheckout, refetch } = useCheckout();
	const { authenticated } = useUser();

	const [{ fetching: fetchingCustomerAttach }, customerAttach] = useCheckoutCustomerAttachMutation();

	const onSubmit = useSubmit<{}, typeof customerAttach>(
		useMemo(
			() => ({
				hideAlerts: true,
				scope: "checkoutCustomerAttach",
				shouldAbort: () =>
					!!checkout?.user?.id || !authenticated || fetchingCustomerAttach || fetchingCheckout,
				onSubmit: customerAttach,
				parse: ({ languageCode, checkoutId }) => ({ languageCode, checkoutId }),
				onError: ({ errors }) => {
					if (
						errors.some(
							(error) =>
								error?.message?.includes(
									"[GraphQL] You cannot reassign a checkout that is already attached to a user.",
								),
						)
					) {
						refetch();
					}
				},
			}),
			[authenticated, checkout?.user?.id, customerAttach, fetchingCheckout, fetchingCustomerAttach, refetch],
		),
	);

	useEffect(() => {
		void onSubmit();
	}, [onSubmit]);
};
