import React from 'react'

export const useClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (e: TouchEvent | MouseEvent) => void) => {
  const listener = (event: TouchEvent | MouseEvent) => {
    if (!ref.current || ref.current.contains(event.target as Node)) {
      return;
    }
    handler(event);
  };

  React.useEffect(
    () => {
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    [ref, handler]
  );
}
