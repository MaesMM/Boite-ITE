import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import BoxCard from "../../components/shared/BoxCard/BoxCard";

import styles from "./Rooms.module.scss";

import { ReactComponent as Plus } from "../../assets/icons/Plus.svg";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import BuildingContainer from "../../components/shared/BuildingContainer/BuildingContainer";

import api from "../../services/api";
import refreshContext from "../../contexts/refreshContext";

const Rooms = () => {
  const [buildings, setBuildings] = useState([]);
  const [newBoxes, setNewBoxes] = useState([]);

  const { refresh } = useContext(refreshContext);

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get("/buildings/").then((res) => {
      setBuildings(res.data);
    });

    api.get("/boxes/new/").then((res) => {
      setNewBoxes(res.data);
    });
  }, []);

  useEffect(() => {
    api.get("/buildings/").then((res) => {
      setBuildings(res.data);
    });

    api.get("/boxes/new/").then((res) => setNewBoxes(res.data));
  }, [refresh]);

  return (
    <main>
      <h1 className="pageTitle">Vos pièces</h1>
      {newBoxes.length !== 0 && (
        <section className="section">
          <h2 className="sectionTitle">Nouvelles connexions</h2>
          <InfoMessage
            type="success"
            title="Nouveaux appareils en attente"
            message="Une ou plusieurs boites se sont connectées à votre serveur et sont en attente d'être configurées"
          />
          <div className="list">
            {newBoxes.map((box) => {
              return (
                <BoxCard
                  key={box.uuid}
                  uuid={box.uuid}
                  type="configuration"
                  macAddress={box.mac}
                />
              );
            })}
          </div>
        </section>
      )}
      <section className="section">
        <div className={`row ${styles.title}`}>
          <h2 className="sectionTitle">Vos batiments</h2>
          <Link to="/buildings/create">
            <Plus className={styles.add} />
          </Link>
        </div>
        <div className="list">
          {buildings.length > 0 ? (
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
              message="Vous n'avez créé aucun batiment"
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default Rooms;
