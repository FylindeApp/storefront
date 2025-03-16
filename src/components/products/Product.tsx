import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../store/slices/productSlice";
import { RootState, AppDispatch } from "../../store";
import { ProductContainer } from "./Product.styles";
import { AddButton } from "../AddButton";
import { VariantSelector } from "../VariantSelector";
import { AvailabilityMessage } from "../AvailabilityMessage";
import { ProductImageWrapper } from "../atoms/ProductImageWrapper";
import { formatMoney } from "../../lib/utils";
import DOMPurify from "dompurify"; // ✅ Replacing `xss`
import { fetchProductDetails } from "../../services/productService";

type Props = {
    slug: string;
    channel: string;
};

const Product: React.FC<Props> = ({ slug, channel }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentProduct, status } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(fetchProduct({ slug, channel }));
    }, [dispatch, slug, channel]);

    if (status === "loading") return <p>Loading...</p>;
    if (!currentProduct) return <p>Product not found.</p>;

    return (
        <ProductContainer>
            <h1>{currentProduct.name}</h1>
            {currentProduct.thumbnail && (
                <ProductImageWrapper alt={currentProduct.name} width={500} height={500} src={currentProduct.thumbnail.url} />
            )}
            <p>{formatMoney(currentProduct.pricing?.priceRange?.start?.gross.amount, currentProduct.pricing?.priceRange?.start?.gross.currency)}</p>
            <VariantSelector variants={currentProduct.variants} product={currentProduct} channel={channel} />
            <AvailabilityMessage isAvailable={currentProduct.variants.some((v: any) => v.quantityAvailable)} />
            <AddButton disabled={!currentProduct.variants.length} />
            {currentProduct.description && (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentProduct.description) }} />
            )}
        </ProductContainer>
    );
};

export default Product;
