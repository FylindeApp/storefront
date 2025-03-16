import React from "react";
import { useFylindeAuthContext  } from "@fylinde/auth-sdk/dist/react";
import { SignInFormContainer, type SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { Button } from "../../Button";
import { useUser } from "../../hooks/useUser";

interface SignedInUserProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
	onSignOutSuccess: () => void;
}

export const SignedInUser: React.FC<SignedInUserProps> = ({ onSectionChange, onSignOutSuccess }) => {
	const { signOut } = useFylindeAuthContext();

	const { user } = useUser();

	const handleLogout = async () => {
		signOut();
		onSignOutSuccess();
	};

	return (
		<SignInFormContainer title="Account" onSectionChange={onSectionChange}>
			<div className="flex flex-row justify-between">
				<p className="text-base font-bold">{user?.email}</p>
				<Button ariaLabel="Sign out" variant="tertiary" onClick={handleLogout}>
					Sign out
				</Button>

			</div>
		</SignInFormContainer>
	);
};
