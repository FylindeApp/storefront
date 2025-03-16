import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import StyledSticky from "./SickyStyle";

export interface StickyProps {
  fixedOn: number;
  containerRef?: { current: any };
  children?: ReactElement;
  onSticky?: (isFixed: boolean) => void;
  notifyOnScroll?: (hasReachedPosition: boolean) => void;
  notifyPosition?: number;
}

const Sticky: React.FC<StickyProps> = ({
  fixedOn,
  containerRef,
  children,
  notifyPosition,
  notifyOnScroll,
  onSticky,
}) => {
  const [fixed, setFixed] = useState(false);
  const [parentHeight, setParentHeight] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null); // Use proper type for elementRef
  const positionRef = useRef<number | null>(null); // Initialize positionRef as number or null

  const scrollListener = useCallback(() => {
    if (positionRef.current === null) return;

    const distance = window.pageYOffset - positionRef.current;

    if (containerRef?.current) {
      const containerDistance =
        containerRef.current.offsetTop +
        containerRef.current.offsetHeight -
        window.pageYOffset;

      if (notifyPosition && notifyOnScroll) {
        notifyOnScroll(
          distance <= notifyPosition && containerDistance > notifyPosition
        );
      }
      setFixed(distance <= fixedOn && containerDistance > fixedOn);
    } else {
      if (notifyPosition && notifyOnScroll) {
        notifyOnScroll(distance >= notifyPosition);
      }

      setFixed(distance >= fixedOn);
    }
  }, [fixedOn, notifyOnScroll, notifyPosition, containerRef, setFixed]); // ✅ Ensure `setFixed` is included


  useEffect(() => {
    window.addEventListener("scroll", scrollListener);
    window.addEventListener("resize", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
      window.removeEventListener("resize", scrollListener);
    };
  }, [scrollListener]);

  useEffect(() => {
    const updatePosition = () => {
      if (elementRef.current && positionRef.current === null) {
        positionRef.current = elementRef.current.offsetTop || 0; // Fallback to 0
      }
      setParentHeight(elementRef.current?.offsetHeight || 0);
    };

    updatePosition(); // ✅ Ensure it runs on first mount
  }, [children]); // ✅ Only re-run when children change


  useEffect(() => {
    if (onSticky) onSticky(fixed);
  }, [fixed, onSticky]);

  return (
    <StyledSticky
      componentPosition={positionRef.current || 0} // Fallback to 0 if positionRef is null
      componentHeight={parentHeight}
      fixedOn={fixedOn}
      fixed={fixed}
      ref={elementRef}
    >
      {children ? React.cloneElement(children, { isFixed: fixed }) : null}
    </StyledSticky>
  );
};

export default Sticky;
