import Selector from "../../components/shared/Selector/Selector";
import styles from "./CreateDevice.module.scss";

import { useState } from "react";
import Device from "../Device/Device";

const CreateDevice = () => {
  const [room, setRoom] = useState(null);

  return (
    <main className="page">
      <h1 className="pageTitle">Configurer un nouvel appareil</h1>
      <section className="section">
        <h2 className="sectionTitle">Informations</h2>
        <div className="form-group">
          <label className="label">Donnez un nom à votre appareil</label>
          <input
            type="text"
            placeholder="Nom de l'appareil"
            className="input"
          />
        </div>
      </section>

      <button className="bigButton">Enregistrer</button>
    </main>
  );
};

export default CreateDevice;
