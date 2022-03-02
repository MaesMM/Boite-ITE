import styles from "./Navbar.module.scss";
import { NavLink } from "react-router-dom";

import { ReactComponent as Home } from "../../assets/icons/Home.svg";
import { ReactComponent as Settings } from "../../assets/icons/Setting.svg";
import { ReactComponent as Rooms } from "../../assets/icons/Rooms.svg";
import { ReactComponent as Box } from "../../assets/icons/Box.svg";

const Navbar = () => {
  return (
    <aside className={styles.navbar}>
      <div className={styles.top}>
        <div className={styles.user}>
          <img src="https://picsum.photos/200" className={styles.userImg} />
          <div className={styles.userInfo}>
            <div className={styles.userName}>Stéphane</div>
            <div className={styles.userName}>Fardoux</div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <nav className={styles.navigation}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} ${isActive && styles.selected}`
            }
          >
            <Home className={styles.icon} />
            <span className={styles.text}>Tableau de bord</span>
          </NavLink>
          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              `${styles.link} ${isActive && styles.selected}`
            }
          >
            <Rooms className={styles.icon} />
            <span className={styles.text}>Vos pièces</span>
          </NavLink>
          <NavLink
            to="/devices"
            className={({ isActive }) =>
              `${styles.link} ${isActive && styles.selected}`
            }
          >
            <Box className={styles.icon} />
            <span className={styles.text}>Vos appareils</span>
          </NavLink>
          {/* <NavLink
            to="/journal"
            className={({ isActive }) =>
              `${styles.link} ${isActive && styles.selected}`
            }
          >
            Journal
          </NavLink>*/}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.link} ${isActive && styles.selected}`
            }
          >
            <Settings className={styles.icon} />
            <span className={styles.text}>Paramètres</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Navbar;
