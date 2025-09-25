import { useState } from 'react';
import styles from "./BackgroundBlur.module.css";
/**
 * Helpful for a very specific background blurring effect,
 * this is animated to blur-in, currently does not blur
 * out.
 **/
interface BackgroundBlurrerProperties {
  showBlocker: boolean;
};

function BackgroundBlurrer(
  { showBlocker } : BackgroundBlurrerProperties) {
  const [lastShowBlocker, setLastShowBlocker] = useState(false);
  const [currentShowBlocker, setShowBlocker] = useState(false);

  if (currentShowBlocker !== showBlocker) {
    setLastShowBlocker(currentShowBlocker);
    setShowBlocker(showBlocker);
  }

  const classNameToUse =
    (lastShowBlocker && !currentShowBlocker) ? styles.fadeOff:
    (!lastShowBlocker && currentShowBlocker) ? styles.fadeOn : '';


  return (
    <div className={classNameToUse} id={styles.backgroundBlurrer}/>
  );
}

export default BackgroundBlurrer;
