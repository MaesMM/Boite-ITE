import RoomCard from "../RoomCard/RoomCard";
import styles from "./BuildingContainer.module.scss";

import { ReactComponent as Plus } from "../../../assets/icons/Plus.svg";
import { ReactComponent as Delete } from "../../../assets/icons/Delete.svg";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import refreshContext from "../../../contexts/refreshContext";
import notificationContext from "../../../contexts/notificationContext";

const BuildingContainer = ({ name, uuid }) => {
  const [rooms, setRooms] = useState(null);

  const { refresh, setRefresh } = useContext(refreshContext);
  const { setNotification } = useContext(notificationContext);

  useEffect(() => {
    uuid &&
      api.get(`/building/${uuid}/`).then((res) => setRooms(res.data.rooms));
  }, [uuid]);

  const handleDelete = () => {
    if (uuid) {
      if (
        window.confirm(
          "Êtes-vous sûr de vouloir supprimer ce batiment ? Cela entrainera la suppression des pièces et l'oubli des boîtes qui y sont assignées"
        )
      ) {
        api
          .delete(`/building/${uuid}/delete/`)
          .then((res) => {
            res.status === 200 && setRefresh(!refresh);
            res.status === 200 &&
              setNotification({
                show: true,
                type: "success",
                text: "Batiment supprimé avec succès !",
              });
          })
          .catch(() => {
            setNotification({
              show: true,
              type: "error",
              text: "Une erreur est survenue",
            });
          });
      }
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.name}>{name && name}</h2>
        <div className={styles.delete} onClick={handleDelete}>
          <Delete />
        </div>
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
