import React from "react";
import { useSelector } from "react-redux";
import Cart from "../components/cart/Cart";
import { RootState } from "../store"; // Ensure you import the correct Redux state type

const CartPage = () => {
	// 🔥 Get cart items dynamically from Redux
	const cartItems = useSelector((state: RootState) => state.cart.items);

	return <Cart initialItems={cartItems} />;
};

export default CartPage;
