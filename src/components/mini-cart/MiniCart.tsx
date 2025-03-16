import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/reduxHooks";
import FlexBox from "../FlexBox";
import LinearProgress from "../progressbar/LinearProgress";
import { Button } from "../checkout";
import Icon from "../icon/Icon";
import Typography, { Paragraph } from "../Typography";
import { StyledMiniCart, StyledCartItem } from "./MiniCartStyle";
import { removeCartItem, changeCartAmount, selectCartWithConvertedPrices } from "../../store/slices/cartSlice";
import { formatCurrency } from "../../utils/localizationUtils";

export type MiniCartProps = {
  toggleSidenav: () => void;
  currentStep: number;
};

const MiniCart: React.FC<MiniCartProps> = ({ toggleSidenav, currentStep }) => {
  const dispatch = useAppDispatch();

  // Fetch cart items with converted prices
  const items = useAppSelector(selectCartWithConvertedPrices);
  const buyerCurrency = useAppSelector((state) => state.exchangeRate.baseCurrency);

  // Calculate subtotal in buyer's currency
  const subtotal = items.reduce((acc, item) => acc + item.buyerPrice * item.quantity, 0);

  // Free shipping progress
  const freeShippingThreshold = 50;
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const handleRemoveItem = (id: string) => dispatch(removeCartItem({ lineId: id, checkoutId: "" }));
  const handleChangeQuantity = (id: string, quantity: number) =>
    dispatch(changeCartAmount({ id, amount: quantity }));

  return (
    <StyledMiniCart>
      {/* Free Shipping Progress */}
      <div className="free-shipping">
        <LinearProgress
          value={freeShippingProgress}
          label={
            remainingForFreeShipping > 0
              ? `You're ${formatCurrency(remainingForFreeShipping, buyerCurrency)} away from free shipping!`
              : "Congratulations! You’ve earned free shipping!"
          }
          color="primary"
          thickness={8}
        />
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {items.length === 0 ? (
          <FlexBox justifyContent="center" alignItems="center" height="100%">
            <Paragraph>Your cart is empty!</Paragraph>
          </FlexBox>
        ) : (
          items.map((item) => (
            <StyledCartItem key={item.id}>
              <img src={item.imgUrl || "/assets/default-product.jpg"} alt={item.name} />
              <div className="item-details">
                <Typography>{item.name}</Typography>
                <Typography fontSize="small">
                  {formatCurrency(item.price, item.currency)} ({item.currency})
                </Typography>
                <Typography fontSize="small">
                  {formatCurrency(item.buyerPrice, buyerCurrency)} ({buyerCurrency})
                </Typography>
                <FlexBox alignItems="center" justifyContent="space-between" mt="0.5rem">
                  <div className="quantity-controls">
                    <Button variant="secondary" onClick={() => handleChangeQuantity(item.id, item.quantity - 1)}>
                      -
                    </Button>
                    <span className="quantity">{item.quantity}</span>
                    <Button variant="secondary" onClick={() => handleChangeQuantity(item.id, item.quantity + 1)}>
                      +
                    </Button>
                  </div>
                </FlexBox>
              </div>
              <Icon color="error" size="small" onClick={() => handleRemoveItem(item.id)} style={{ cursor: "pointer" }}>
                delete
              </Icon>
            </StyledCartItem>
          ))
        )}
      </div>

      {/* Subtotal */}
      <div className="cart-summary">
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography fontWeight="600">Subtotal:</Typography>
          <Typography fontWeight="600">{formatCurrency(subtotal, buyerCurrency)}</Typography>
        </FlexBox>
      </div>

      {/* Actions */}
      {items.length > 0 && (
        <FlexBox justifyContent="space-between" mt="1rem">
          <Link to="/cart">
            <Button variant="secondary" fullwidth onClick={toggleSidenav}>
              View Full Cart
            </Button>
          </Link>
          <Link to="/checkout">
            <Button variant="primary" fullwidth>
              Checkout
            </Button>
          </Link>
        </FlexBox>
      )}

      {/* Show progress step indicator */}
      {currentStep >= 0 && (
        <FlexBox justifyContent="center" mt="1rem">
          <Typography fontSize="small">Current Checkout Step: {currentStep + 1}</Typography>
        </FlexBox>
      )}
    </StyledMiniCart>
  );
};

export default MiniCart;
