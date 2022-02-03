import RoomCard from "../RoomCard/RoomCard";
import styles from "./BuildingContainer.module.scss";

import { useState, useEffect } from "react";

const BuildingContainer = ({ name, id }) => {
  useEffect(() => {
    // Fetch some data here

    let data = [
      {
        name: "Salle rouge",
        color: "#000",
        state: true,
      },
      {
        name: "Salle rouge",
        color: "#000",
        state: true,
      },
      {
        name: "Salle rouge",
        color: "#000",
        state: true,
      },
      {
        name: "Salle rouge",
        color: "#000",
        state: true,
      },
    ];

    setRooms(data);
  }, []);

  const [rooms, setRooms] = useState([]);

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.name}>{name && name}</h2>
      </header>
      <div className="list">
        {rooms &&
          rooms.map((room) => {
            return <RoomCard />;
          })}
      </div>
    </article>
  );
};

export default BuildingContainer;
