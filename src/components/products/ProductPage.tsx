import React from "react";
import Product from "./Product";

type Props = {
    params: { slug: string; channel: string };
};

const ProductPage: React.FC<Props> = ({ params }) => {
    return <Product slug={params.slug} channel={params.channel} />;
};

export default ProductPage;
