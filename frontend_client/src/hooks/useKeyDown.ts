import { useEffect } from 'react';

function useKeyDown(
  key: string,
  onKeyDown : ()=>void) {
  useEffect(
    function() {
      const keydownListener =
	function(e: KeyboardEvent) {
	  if (e.key === key) {
	    onKeyDown();
	  }
	};
      document.addEventListener("keydown", keydownListener);
      return () => document.removeEventListener("keydown", keydownListener);
    },
    []
  );
}

export default useKeyDown;