import {
  useState,
  useLayoutEffect,
} from 'react';

/**
    NOTE(jerry):

    This is a funny little hack to
    get around the fact that we can't know
    the size of DOM elements until they're rendered,
    and that there's no easy way for us to get those
    sizes from CSS in Type/Javscript.

    It *might* cause more re-renders and maybe some performance
    hits, but on a modern computer this is probably imperceptible.

    Also might cause more GC hits, but this was made so that the
    D3 elements could be trivially responsive with little code changes.
**/

function getCssCalculation(css: string): number {
  const dummyElement = document.createElement("div");
  dummyElement.style.width = css;
  dummyElement.style.position = "absolute";
  dummyElement.style.visibility = "hidden";

  document.body.appendChild(dummyElement);

  const elementWidth = dummyElement.getBoundingClientRect().width

  dummyElement.remove();
  return elementWidth;
}

function useCssCalc(css: string): number {
  const [value, setValue] = useState<number>(0);
  useLayoutEffect(
    function () {
      const resizeHandler =
	function() {
	  setValue(getCssCalculation(css));
	}
      resizeHandler(); // Do an initial setting of the render.
      window.addEventListener("resize", resizeHandler);
      return () => window.removeEventListener("resize", resizeHandler);
    },
    [css]);
  return value;
}

export default useCssCalc;
