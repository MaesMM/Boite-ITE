import styles from "./Navbar.module.scss";
import { NavLink } from "react-router-dom";

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
            Tableau de bord
          </NavLink>
          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              `${styles.link} ${isActive && styles.selected}`
            }
          >
            Vos pièces
          </NavLink>
          <NavLink
            to="/devices"
            className={({ isActive }) =>
              `${styles.link} ${isActive && styles.selected}`
            }
          >
            Vos appareils
          </NavLink>
          {/* <NavLink
            to="/journal"
            className={({ isActive }) =>
              `${styles.link} ${isActive && styles.selected}`
            }
          >
            Journal
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.link} ${isActive && styles.selected}`
            }
          >
            Paramètres
          </NavLink> */}
        </nav>
      </div>
    </aside>
  );
};

export default Navbar;
