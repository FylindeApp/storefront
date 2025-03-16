import { PageGetBySlugDocument } from "../gql/graphql";
import { executeGraphQL } from "../lib/graphql";

export const fetchPageBySlug = async (slug: string) => {
    try {
        const { page } = await executeGraphQL(PageGetBySlugDocument, {
            variables: { slug}, // ✅ Now channel is allowed
            revalidate: 60,
        });

        return page;
    } catch (error) {
        console.error("Error fetching page:", error);
        return null;
    }
};

