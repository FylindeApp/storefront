import { config as dotenvConfig } from "dotenv";
import type { CodegenConfig } from "@graphql-codegen/cli";

// Load environment variables from `.env`
dotenvConfig();

// Use local schema by default to remove dependency on Saleor API
let schemaUrl = "schema.graphql";

if (process.env.USE_REMOTE_SCHEMA === "true") {
	schemaUrl = process.env.NEXT_PUBLIC_FYLINDE_API_URL || "schema.graphql";
}

const gqlCodegenConfig: CodegenConfig = {
	overwrite: true,
	schema: schemaUrl,  // ✅ Use local schema file
	documents: "src/graphql/**/*.graphql",
	generates: {
		"src/gql/": {
			preset: "client",
			plugins: [],
			config: {
				documentMode: "string",
				useTypeImports: true,
				strictScalars: true,
				scalars: {
					Date: "string",
					DateTime: "string",
					Day: "number",
					Decimal: "number",
					GenericScalar: "unknown",
					JSON: "unknown",
					JSONString: "string",
					Metadata: "Record<string, string>",
					Minute: "number",
					PositiveDecimal: "number",
					UUID: "string",
					Upload: "unknown",
					WeightScalar: "unknown",
					_Any: "unknown",
				},
			},
			presetConfig: {
				fragmentMasking: false,
			},
		},
	},
};

export default gqlCodegenConfig;
