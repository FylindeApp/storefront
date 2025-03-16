import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { removeCartItem, setCartItems } from "../../store/slices/cartSlice";
import { DeleteLineButton } from "./DeleteLineButton";
import { CartContainer, CartItem } from "./Cart.styles";

type CartProps = {
    initialItems: {
        id: string;
        name: string;
        price: number; // ✅ Ensure price is a number
        checkoutId: string;
        quantity: number; // ✅ Add missing quantity
        currency: string; // ✅ Add missing currency
    }[];
};


const Cart: React.FC<CartProps> = ({ initialItems }) => {
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    useEffect(() => {
        dispatch(setCartItems(initialItems)); // Load initial cart items into Redux
    }, [dispatch, initialItems]);

    const handleRemoveItem = (lineId: string, checkoutId: string) => {
        dispatch(removeCartItem({ lineId, checkoutId }));
    };

    return (
        <CartContainer>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                cartItems.map((item) => (
                    <CartItem key={item.id}>
                        <p>{item.name}</p>
                        <p>{item.price}</p>
                        <DeleteLineButton
                            lineId={item.id}
                            checkoutId={item.checkoutId}
                            onDelete={() => handleRemoveItem(item.id, item.checkoutId)}
                        />
                    </CartItem>
                ))
            )}
        </CartContainer>
    );
};

export default Cart;
