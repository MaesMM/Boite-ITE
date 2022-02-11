import Switch from "../Switch/Switch";

import styles from "./RoomCard.module.scss";

import { ReactComponent as Battery } from "../../../assets/icons/Battery.svg";
import { ReactComponent as Thermometer } from "../../../assets/icons/Thermometer.svg";
import { ReactComponent as Drop } from "../../../assets/icons/Drop.svg";
import { ReactComponent as Sun } from "../../../assets/icons/Sun.svg";

import { useState } from "react";
import { Link } from "react-router-dom";

const RoomCard = ({ id }) => {
  let data = {
    id: 1,
    name: "Salle Rouge",
    color: "#FA9E9E",
    temperature: "22°C",
    humidity: "22%",
    battery: 67,
    luminosity: "Lumineux",
  };

  const [isSwitchedOn, setIsSwitchedOn] = useState(false);

  const color = {
    "--color": data.color,
  };
  
  const battery = {
    "--battery": data.battery + "%",
  };

  const handleToggle = () => {
    // Do some api toggling here
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <Link to={"/rooms/" + data.id} className={styles.headerLeft}>
          <div className={styles.color} style={color}></div>
          <h2>{data && data.name}</h2>
        </Link>
        <div className={styles.headerRight}>
          <Switch
            state={isSwitchedOn}
            setState={setIsSwitchedOn}
            callback={handleToggle}
          />
        </div>
      </header>
      <ul className={styles.list}>
        <li className={styles.detail}>
          <div className={styles.icon}>
            <Thermometer className={styles.thermometer} />
          </div>
          <span className={styles.value}>
            {data.temperature ? data.temperature : "--"}
          </span>
        </li>
        <li className={styles.detail}>
          <div className={styles.icon}>
            <Drop className={styles.drop} />
          </div>
          <span className={styles.value}>
            {data.humidity ? data.humidity : "--"}
          </span>
        </li>
        <li className={styles.detail}>
          <div className={styles.icon}>
            <Sun className={styles.sun} />
          </div>
          <span className={styles.value}>
            {data.luminosity ? data.luminosity : "--"}
          </span>
        </li>
      </ul>

      <footer className={styles.footer}>
        <div className={styles.batteryContainer}>
          <div className={styles.batteryIndicatorContainer}>
            <Battery className={styles.batteryIcon} />
            <div className={styles.battery}>
              <div
                className={`${styles.batteryIndicator} ${
                  data.battery <= 25 && styles.low
                } ${50 > data.battery && data.battery > 25 && styles.medium} ${
                  data.battery >= 50 && styles.high
                }`}
                style={battery}
              ></div>
            </div>
          </div>
          <span>{data.battery} %</span>
        </div>
        <Link to={"/rooms/" + data.id} className={styles.link}>
          Voir la pièce
        </Link>
      </footer>
    </article>
  );
};

export default RoomCard;
