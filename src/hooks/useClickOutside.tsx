import { useEffect } from "react";

function useOnClickOutside(ref: any, handler: any, ignoreClass = ``) {
  useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (
        !ref?.current ||
        ref?.current?.contains(event?.target) ||
        (ignoreClass &&
          (event?.target?.classList.contains(ignoreClass) ||
            event?.target?.parentElement?.classList.contains(ignoreClass)))
      ) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;
