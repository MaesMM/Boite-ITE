import styles from "./Switch.module.scss";

const Switch = ({
  state,
  setState,
  touched,
  setTouched,
  callback,
  styling,
}) => {
  return (
    <div
      onClick={() => {
        setState(!state);
        setTouched(true);
      }}
      className={`${styles.switch} ${touched && !state && styles.off} ${
        state && styles.on
      } ${styling && styles[styling]}`}
    >
      <div className={styles.thumb}></div>
    </div>
  );
};

export default Switch;
