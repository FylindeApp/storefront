"use client";

import React, { useEffect } from "react";
import { ErrorContainer, ErrorMessage, ErrorButton } from "./ErrorStyles";

type Props = {
	error: Error;
	reset: () => void;
};

const ErrorComponent: React.FC<Props> = ({ error, reset }) => {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<ErrorContainer>
			<h1>Something went wrong</h1>
			<ErrorMessage>
				<code>{error.message}</code>
			</ErrorMessage>
			<ErrorButton onClick={reset}>Try again</ErrorButton>
		</ErrorContainer>
	);
};

export default ErrorComponent;
