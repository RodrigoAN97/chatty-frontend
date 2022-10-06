import { useEffect, useRef } from "react";

export const useClickOutside = (customHandler) => {
  let domNode = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (!domNode.current.contains(event.target)) {
        customHandler();
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return domNode;
};
