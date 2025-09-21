import styles from "./BackgroundBlur.module.css";
/**
 * Helpful for a very specific background blurring effect,
 * this is animated to blur-in, currently does not blur
 * out.
 **/
function BackgroundBlurrer() {
  return (
    <div id={styles.backgroundBlurrer}/>
  );
}

export default BackgroundBlurrer;
