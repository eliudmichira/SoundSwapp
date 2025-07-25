import { useEffect, RefObject } from "react";

export function useMousePosition<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback?: ({ x, y }: { x: number; y: number }) => void,
) {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { top, left } = ref.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };
      callback?.({ x: clientX - left, y: clientY - top });
    };
    const handleTouchMove = (event: TouchEvent) => {
      const { clientX, clientY } = event.touches[0];
      const { top, left } = ref.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };
      callback?.({ x: clientX - left, y: clientY - top });
    };
    ref.current?.addEventListener("mousemove", handleMouseMove, { passive: true });
    ref.current?.addEventListener("touchmove", handleTouchMove, { passive: true });
    const nodeRef = ref.current;
    return () => {
      nodeRef?.removeEventListener("mousemove", handleMouseMove);
      nodeRef?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [ref, callback]);
} 