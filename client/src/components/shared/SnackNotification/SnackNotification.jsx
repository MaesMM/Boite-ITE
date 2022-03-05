import { useContext, useEffect, useState } from "react";
import notificationContext from "../../../contexts/notificationContext";
import styles from "./SnackNotification.module.scss";

import { ReactComponent as Success } from "../../../assets/icons/Success.svg";
import { ReactComponent as Info } from "../../../assets/icons/Info.svg";
import { ReactComponent as Warning } from "../../../assets/icons/Warning.svg";
import { ReactComponent as Error } from "../../../assets/icons/Error.svg";

const SnackNotification = () => {
  const [exists, setExists] = useState(false);

  const { notification, setNotification } = useContext(notificationContext);

  useEffect(() => {
    setTimeout(() => setExists(true), 500);
  }, []);

  useEffect(() => {
    if (notification.show) {
      setTimeout(() => {
        setNotification({
          ...notification,
          show: false,
        });
      }, 3500);
    }
  }, [notification]);

  return (
    <div
      className={`${styles.notification} ${
        notification && notification.type === "success" && styles.success
      } ${notification && notification.type === "info" && styles.info} ${
        notification && notification.type === "warning" && styles.warning
      } ${notification && notification.type === "error" && styles.error} ${
        exists && styles.exists
      } ${notification && notification.show && styles.show}`}
    >
      <div className={styles.icon}>
        {notification.type === "success" && <Success className={styles.icon} />}
        {notification.type === "info" && <Info className={styles.icon} />}
        {notification.type === "warning" && <Warning className={styles.icon} />}
        {notification.type === "error" && <Error className={styles.icon} />}
      </div>
      <h2 className={styles.content}>{notification.text}</h2>
    </div>
  );
};

export default SnackNotification;
