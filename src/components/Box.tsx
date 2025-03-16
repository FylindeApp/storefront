import styled from "styled-components";
import {
  border,
  color,
  compose,
  flex,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  typography,
  type BorderProps,
  type ColorProps,
  type FlexboxProps,
  type FlexProps,
  type GridProps,
  type LayoutProps,
  type PositionProps,
  type ShadowProps,
  type SpaceProps,
  type TypographyProps,
} from "styled-system"; // ✅ Combined imports


// Extended BoxProps to include more customization options
type BoxProps = {
  shadow?: number; // Custom shadow level
  cursor?: string; // Cursor style
  transition?: string; // Transition for animations
  gap?: string | number; // Gap for flex/grid layouts
  as?: keyof JSX.IntrinsicElements; // Element type for polymorphic support
} & LayoutProps &
  ColorProps &
  PositionProps &
  SpaceProps &
  FlexProps &
  BorderProps &
  FlexboxProps &
  TypographyProps &
  GridProps &
  ShadowProps; // Added grid and shadow props for advanced layouts

// Styled component
const Box = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["shadow", "gap", "transition", "cursor"].includes(prop),
})<BoxProps>(
  ({ shadow = 0, cursor = "unset", transition, gap, theme }) => {
    const boxShadow: string =
      theme.shadows && typeof theme.shadows[shadow] === "string"
        ? theme.shadows[shadow]
        : "none"; // ✅ Type-safe

    return {
      boxShadow,
      cursor,
      transition,
      gap,
    };
  },
  compose(layout, space, color, position, flexbox, flex, border, typography, grid, shadow)
);

Box.defaultProps = {
  shadow: 0, // Default shadow
  cursor: "unset", // Default cursor
  transition: "all 0.3s ease-in-out", // Smooth transition
};

export default Box;
