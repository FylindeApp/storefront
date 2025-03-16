import { useEffect, useMemo, useRef, useState } from "react";
import { type CountryCode, usePaymentGatewaysInitializeMutation } from "../../graphql";
import { useCheckout } from "../../hooks/useCheckout";
import { useSubmit } from "../../hooks/useSubmit";
import { type MightNotExist } from "../../lib/globalTypes";
import { type ParsedPaymentGateways } from "../PaymentSection/types";
import { getFilteredPaymentGateways } from "../PaymentSection/utils";

export const usePaymentGatewaysInitialize = () => {
	const {
		checkout: { billingAddress },
	} = useCheckout();
	const {
		checkout: { id: checkoutId, availablePaymentGateways },
	} = useCheckout();

	const billingCountry = billingAddress?.country.code as MightNotExist<CountryCode>;

	const [gatewayConfigs, setGatewayConfigs] = useState<ParsedPaymentGateways>([]);
	const previousBillingCountry = useRef(billingCountry);

	const [{ fetching }, paymentGatewaysInitialize] = usePaymentGatewaysInitializeMutation();

	const onSubmit = useSubmit<{}, typeof paymentGatewaysInitialize>(
		useMemo(
			() => ({
				hideAlerts: true,
				scope: "paymentGatewaysInitialize",
				shouldAbort: () => !availablePaymentGateways.length,
				onSubmit: paymentGatewaysInitialize,
				parse: () => ({
					checkoutId,
					paymentGateways: getFilteredPaymentGateways(availablePaymentGateways).map(({ config, id }) => ({
						id,
						data: config,
					})),
				}),
				onSuccess: ({ data }) => {
					const parsedConfigs = (data.gatewayConfigs || []) as ParsedPaymentGateways;

					if (!parsedConfigs.length) {
						throw new Error("No available payment gateways");
					}

					setGatewayConfigs(parsedConfigs);
				},
				onError: ({ errors }) => {
					console.log({ errors });
				},
			}),
			[availablePaymentGateways, checkoutId, paymentGatewaysInitialize],
		),
	);

	useEffect(() => {
		void onSubmit();
	}, [onSubmit]);

	useEffect(() => {
		if (billingCountry !== previousBillingCountry.current) {
			previousBillingCountry.current = billingCountry;
			void onSubmit();
		}
	}, [billingCountry, onSubmit]);

	return {
		fetching,
		availablePaymentGateways: gatewayConfigs || [],
	};
};
