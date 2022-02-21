import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import DataCard from "../../components/shared/DataCard/DataCard";
import BoxCard from "../../components/shared/BoxCard/BoxCard";

import styles from "./Dashboard.module.scss";

import { useEffect, useState } from "react";
import BuildingContainer from "../../components/shared/BuildingContainer/BuildingContainer";
import api from "../../services/api";

const Dashboard = () => {
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
      <h1 className="pageTitle">Tableau de bord</h1>
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
            <DataCard type="plain" title="Relevés aujourd'hui" value="45" />
            <DataCard type="alerts" title="Alertes" value="69" />
          </article>
          <article className="list">
            <DataCard
              type="minTemp"
              title="Température minimale"
              value="15°C"
            />
            <DataCard
              type="temperature"
              title="Température moyenne"
              value="22°C"
            />
            <DataCard
              type="maxTemp"
              title="Température maximale"
              value="35°C"
            />
            <DataCard type="humidity" title="Humidité moyenne" value="35%" />
            <DataCard type="average" title="Donnée actuelle" value="35" />
          </article>
        </section>
      </section>

      <section className="section">
        <h2 className="sectionTitle">Vos batiments</h2>
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

export default Dashboard;
