import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import BoxCard from "../../components/shared/BoxCard/BoxCard";

import styles from "./Rooms.module.scss";

import { ReactComponent as Plus } from "../../assets/icons/Plus.svg";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import BuildingContainer from "../../components/shared/BuildingContainer/BuildingContainer";

import api from "../../services/api";

const Rooms = () => {
  const [buildings, setBuildings] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get("/buildings/").then((res) => {
      console.log(res.data);
      setBuildings(res.data);
    });
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
        <div className="list">
          <BoxCard type="configuration" macAddress="4R:7V:4D:8C:3J" />
        </div>
      </section>
      <section className="section">
        <div className={`row ${styles.title}`}>
          <h2 className="sectionTitle">Vos batiments</h2>
          <Link to="/buildings/create">
            <Plus className={styles.add} />
          </Link>
        </div>
        <div className="list">
          {buildings ? (
            buildings.map((building) => {
              return (
                <BuildingContainer
                  key={building.uuid}
                  uuid={building.uuid}
                  name={building.name}
                />
              );
            })
          ) : (
            <InfoMessage
              type="info"
              message="Vous n'avez créé aucune pièce, ajoutez-en une !"
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default Rooms;
