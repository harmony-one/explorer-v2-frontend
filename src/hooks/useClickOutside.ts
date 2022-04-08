import React from 'react'

export const useClickOutside = (ref: any, handler: any) => {
  const listener = (event: any) => {
    if (!ref.current || ref.current.contains(event.target)) {
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
