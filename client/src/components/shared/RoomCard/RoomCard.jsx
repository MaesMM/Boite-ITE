import Switch from "../Switch/Switch";

import styles from "./RoomCard.module.scss";

import { ReactComponent as Battery } from "../../../assets/icons/Battery.svg";
import { ReactComponent as Thermometer } from "../../../assets/icons/Thermometer.svg";
import { ReactComponent as Drop } from "../../../assets/icons/Drop.svg";
import { ReactComponent as Sun } from "../../../assets/icons/Sun.svg";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

const RoomCard = ({ uuid }) => {
  // let data = {
  //   id: 1,
  //   name: "Salle Rouge",
  //   color: "#FA9E9E",
  //   temperature: "22°C",
  //   humidity: "22%",
  //   battery: 67,
  //   luminosity: "Lumineux",
  // };

  const [isSwitchedOn, setIsSwitchedOn] = useState(false);
  const [data, setData] = useState(null);

  const handleToggle = () => {
    // Do some api toggling here
  };

  useEffect(() => {
    api.get(`/rooms/${uuid}/`).then((res) => {
      setData(res.data);
      console.log(res.data.color);
    });
  }, [uuid]);

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <Link
          to={uuid ? "/rooms/" + uuid + "/" : "/"}
          className={styles.headerLeft}
        >
          <div
            className={styles.color}
            style={{
              "--color": data ? data.color : "#000",
            }}
          ></div>
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
            {data && data.temperature ? data.temperature : "--"}
          </span>
        </li>
        <li className={styles.detail}>
          <div className={styles.icon}>
            <Drop className={styles.drop} />
          </div>
          <span className={styles.value}>
            {data && data.humidity ? data.humidity : "--"}
          </span>
        </li>
        <li className={styles.detail}>
          <div className={styles.icon}>
            <Sun className={styles.sun} />
          </div>
          <span className={styles.value}>
            {data && data.luminosity ? data.luminosity : "--"}
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
                  data && data.battery <= 25 && styles.low
                } ${
                  data &&
                  50 > data.battery &&
                  data.battery > 25 &&
                  styles.medium
                } ${data && data.battery >= 50 && styles.high}`}
                style={
                  data && {
                    "--battery": data.battery + "%",
                  }
                }
              ></div>
            </div>
          </div>
          <span>{data && data.battery} %</span>
        </div>
        <Link to={uuid ? "/rooms/" + uuid + "/" : "/"} className={styles.link}>
          Voir la pièce
        </Link>
      </footer>
    </article>
  );
};

export default RoomCard;
