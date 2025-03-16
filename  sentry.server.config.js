const disableSentry = process.env.SENTRY_DISABLE === "true";

module.exports = {
    dsn: disableSentry ? undefined : process.env.SENTRY_DSN,
    tracesSampleRate: disableSentry ? 0 : 1.0,
};
