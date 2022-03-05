import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import DataCard from "../../components/shared/DataCard/DataCard";
import BoxCard from "../../components/shared/BoxCard/BoxCard";

import styles from "./Dashboard.module.scss";

import { ReactComponent as Plus } from "../../assets/icons/Plus.svg";

import { useContext, useEffect, useState } from "react";
import BuildingContainer from "../../components/shared/BuildingContainer/BuildingContainer";
import api from "../../services/api";
import { Link } from "react-router-dom";
import Connection from "../../components/shared/Connection/Connection";
import refreshContext from "../../contexts/refreshContext";

const Dashboard = () => {
  const [buildings, setBuildings] = useState([]);
  const [newBoxes, setNewBoxes] = useState([]);
  const [count, setCount] = useState("--");

  const { refresh } = useContext(refreshContext);

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get("/buildings/").then((res) => {
      setBuildings(res.data);
    });

    api.get("/boxes/new/").then((res) => setNewBoxes(res.data));

    api.get("/data/get-total/today/").then((res) => setCount(res.data));
  }, []);

  useEffect(() => {
    api.get("/buildings/").then((res) => {
      setBuildings(res.data);
    });

    api.get("/boxes/new/").then((res) => setNewBoxes(res.data));

    api.get("/data/get-total/today/").then((res) => setCount(res.data));
  }, [refresh]);

  return (
    <div className="relative">
      <main>
        <h1 className="pageTitle">Tableau de bord</h1>
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
                    type="configuration"
                    uuid={box.uuid}
                    macAddress={box.mac}
                  />
                );
              })}
            </div>
          </section>
        )}

        <section className="section">
          <h2 className="sectionTitle">Informations</h2>
          <section className={styles.messages}>
            <InfoMessage
              type="error"
              title="Some critical error"
              message="Hey hey hey ! I'm a critical error !"
            />
            <InfoMessage
              type="success"
              title="You made it !"
              message="I don't know what but congrats I guess ?"
            />
            <InfoMessage
              type="warning"
              title="Warning: Low battery"
              message="Charge the box"
            />
            <InfoMessage
              type="info"
              title="Today's fact :"
              message={`You're pretty`}
            />
          </section>
          <section className={styles.summary}>
            <article className="list">
              <DataCard
                type="plain"
                title="Relevés aujourd'hui"
                value={count}
              />
              <DataCard type="alerts" title="Alertes" value="0" />
            </article>
          </section>
        </section>

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
      <Connection />
    </div>
  );
};

export default Dashboard;
