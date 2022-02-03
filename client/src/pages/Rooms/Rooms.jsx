import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import BoxCard from "../../components/shared/BoxCard/BoxCard";
import RoomCard from "../../components/shared/RoomCard/RoomCard";

import styles from "./Rooms.module.scss";

import { ReactComponent as Plus } from "../../assets/icons/Plus.svg";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import BuildingContainer from "../../components/shared/BuildingContainer/BuildingContainer";

const Rooms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page">
      <h1 className="pageTitle">Vos pièces</h1>
      <section className="section">
        <h2 className="sectionTitle">Nouvelles connexions</h2>
        <InfoMessage
          type="success"
          title="Nouveaux appareils en attente"
          message="Une ou plusieurs boites se sont connectées à votre serveur et sont en attente d'être configurées"
        />
        <div class="list">
          <BoxCard type="configuration" macAddress="4R:7V:4D:8C:3J" />
        </div>
      </section>
      <section className="section">
        <div className={`row ${styles.title}`}>
          <h2 className="sectionTitle">Vos batiments</h2>
          <Link to="/rooms/create">
            <Plus className={styles.add} />
          </Link>
        </div>
        <div className="list">
          <BuildingContainer id={3} name="Adimaker" />
        </div>
      </section>
    </main>
  );
};

export default Rooms;
