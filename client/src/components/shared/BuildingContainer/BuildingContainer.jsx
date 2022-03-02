import RoomCard from "../RoomCard/RoomCard";
import styles from "./BuildingContainer.module.scss";

import { ReactComponent as Plus } from "../../../assets/icons/Plus.svg";
import { ReactComponent as Delete } from "../../../assets/icons/Delete.svg";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

const BuildingContainer = ({ name, uuid }) => {
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    uuid &&
      api.get(`/building/${uuid}/`).then((res) => setRooms(res.data.rooms));
  }, [uuid]);

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.name}>{name && name}</h2>
        <Delete className={styles.delete} />
      </header>
      <div className="list">
        {rooms &&
          rooms.map((room) => {
            return <RoomCard key={room.uuid} uuid={room.uuid} />;
          })}

        <Link
          to={`/buildings/${uuid}/rooms/create`}
          className={styles.plusContainer}
        >
          <Plus className={styles.plus} />
        </Link>
      </div>
    </article>
  );
};

export default BuildingContainer;
