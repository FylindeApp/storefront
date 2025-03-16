const { withSentryConfig } = require('@sentry/nextjs');

const isDev = process.env.NODE_ENV === 'development';
const disableSentry = process.env.SENTRY_DISABLE === "true";

const config = {
	images: {
		remotePatterns: [
			{
				hostname: "*",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: isDev,
	},
	experimental: {
		typedRoutes: false,
	},
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined,
};

module.exports = disableSentry ? config : withSentryConfig(config);
