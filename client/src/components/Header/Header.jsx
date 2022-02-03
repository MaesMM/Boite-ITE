import { ReactComponent as Bell } from "../../assets/icons/Notification.svg";
import { ReactComponent as Arrow } from "../../assets/icons/Arrow.svg";
import styles from "./Header.module.scss";

import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerRight}>
        {/* <div className={styles.notificationContainer}>
          <span className={styles.notification}>3</span>
          <Bell className={styles.bell} />
        </div> */}
        <div className={styles.profile}>
          <img
            alt="profile"
            src="https://picsum.photos/200"
            className={styles.userImg}
          />
          <Arrow className={styles.arrow} />
          <nav className={styles.profileNav}>
            <span className={styles.name}>Stéphane Fardoux</span>
            <Link to="/settings">Paramètres</Link>
            <Link to="/logout">Se déconnecter</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
