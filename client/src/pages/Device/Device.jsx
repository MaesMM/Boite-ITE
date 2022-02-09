import Selector from "../../components/shared/Selector/Selector";

import styles from "./Device.module.scss";

import { useState } from "react";
import Switch from "../../components/shared/Switch/Switch";

const Device = () => {
  const [room, setRoom] = useState(null);

  return (
    <main className="page">
      <div className="head">
        <h1 className="pageTitle">Boite 1</h1>
      </div>
      <section className="section">
        <h2 className="sectionTitle">Informations</h2>
        <div className="form-group">
          <label className="label">Nom</label>
          <input type="text" className="input" placeholder="Nom de la pièce" />
        </div>
      </section>

      <section className="section">
        <h2 className="sectionTitle">Pièce</h2>
        <div className={styles.list}>
          <Selector
            type="radio"
            name="test 1"
            id={1}
            selection={room}
            setSelection={setRoom}
          />
          <Selector
            type="radio"
            name="test 2"
            id={2}
            selection={room}
            setSelection={setRoom}
          />
        </div>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Actions sur votre appareil</h2>
        <div className="row">
          <div className="bigButton errorButton">Dissocier l'appareil</div>
        </div>
      </section>
    </main>
  );
};

export default Device;
