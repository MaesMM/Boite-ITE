import styles from "./Switch.module.scss";

import { useState } from "react";

const Switch = ({ state, setState, callback, styling }) => {
  const [touched, setTouched] = useState(false);

  return (
    <div
      onClick={() => {
        setState(!state);
        setTouched(true);
      }}
      className={`${styles.switch} ${touched && !state && styles.off} ${
        state && styles.on
      } ${styling && styling}`}
    >
      <div className={styles.thumb}></div>
    </div>
  );
};

export default Switch;
