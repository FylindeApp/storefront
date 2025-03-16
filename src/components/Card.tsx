import styled from "styled-components";
import { shadowOptions } from "../interfaces";
import {
  border,
  BorderProps,
  color,
  ColorProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
} from "styled-system";
import { getTheme } from "../utils/util";
import Box from "./Box";

export interface CardProps {
  elevation?: number;
  boxShadow?: shadowOptions;
  hoverEffect?: boolean;
}

const Card = styled(Box).withConfig({
  shouldForwardProp: (prop) =>
    !["boxShadow", "elevation", "hoverEffect"].includes(prop), // Filter out custom props
})<ColorProps & SpaceProps & LayoutProps & BorderProps & CardProps>`
  background-color: ${getTheme("colors.body.paper")};
  box-shadow: ${(props) =>
    getTheme(`shadows.${props.boxShadow}`, `shadows.${props.elevation}`)};

  :hover {
    box-shadow: ${(props) => props.hoverEffect && getTheme("shadows.large")};
  }

  ${border}
  ${color}
  ${space}
  ${layout}
`;

Card.defaultProps = {
  boxShadow: "small",
  borderRadius: 8,
  hoverEffect: false,
};

export default Card;
