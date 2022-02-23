import { useState, useEffect } from "react";
import BoxCard from "../../components/shared/BoxCard/BoxCard";
import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import api from "../../services/api";

const Devices = () => {
  const [newBoxes, setNewBoxes] = useState([]);
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    api.get("/boxes/").then((res) => setBoxes(res.data));
    api.get("/boxes/new/").then((res) => setNewBoxes(res.data));
  }, []);

  return (
    <main className="page">
      <h1 className="pageTitle">Vos appareils</h1>
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
              return <BoxCard type="configuration" macAddress={box.mac} />;
            })}
          </div>
        </section>
      )}
      {boxes.length !== 0 && (
        <section className="section">
          <h2 className="sectionTitle">Vos appareils</h2>

          <div className="list">
            {boxes.map((box) => {
              return (
                <BoxCard
                  type="link"
                  name={box.name}
                  link={`/devices/${box.uuid}`}
                />
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};

export default Devices;
