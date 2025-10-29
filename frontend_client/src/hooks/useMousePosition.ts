import { useEffect, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(
    function () {
      const mouseMoveHandler = function (e: MouseEvent) {
        setMouseX(e.clientX);
        setMouseY(e.clientY);
      };

      window.addEventListener("mousemove", mouseMoveHandler);
      return () => window.removeEventListener("mousemove", mouseMoveHandler);
    },
    [mouseX, mouseY]
  );

  return {
    x: mouseX,
    y: mouseY,
  };
}

export default useMousePosition;
export type { MousePosition };
