import { type FallbackProps } from "react-error-boundary";
import { FylindeLogo } from "../../../logos/FylindeLogo";
import { Button } from "../../Button";
import { ErrorContentWrapper } from "../../ErrorContentWrapper";

export const PageNotFound = ({ error }: Partial<FallbackProps>) => {
	console.error(error);

	// eslint-disable-next-line no-restricted-globals
	const goBack = () => history.back();

	return (
		<ErrorContentWrapper>
			<div className="mb-4 flex w-28 flex-col">
				<FylindeLogo />
			</div>
			<p>We couldn't fetch information about your checkout. Go back to the store and try again.</p>

			{/* ✅ Fixed Button */}
			<Button ariaLabel="Go back to store" onClick={goBack} variant="secondary">
				Go back to store
			</Button>

		</ErrorContentWrapper>

	);
};
