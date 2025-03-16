import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedProducts } from "../store/slices/productSlice";
import { RootState, AppDispatch } from "../store";
import { ProductList } from "../components/ProductList";
import { HomePageContainer } from "./HomePage.styles";

const HomePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { featuredProducts, status } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(fetchFeaturedProducts());
    }, [dispatch]);

    if (status === "loading") return <p>Loading featured products...</p>;

    return (
         <HomePageContainer>
            <h1>Welcome to Our Store</h1>
             <ProductList products={featuredProducts} />
         </HomePageContainer>
    );
};

export default HomePage;
