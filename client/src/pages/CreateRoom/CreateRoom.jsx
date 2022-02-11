import styles from "./CreateRoom.module.scss";

import { useEffect, useState } from "react";
import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import BoxSelector from "../../components/shared/Selector/Selector";

const CreateRoom = () => {
  const [color, setColor] = useState("#33c9cc");
  const [selection, setSelection] = useState([]);

  const [colorValue, setColorValue] = useState(null);

  useEffect(() => {
    setColorValue({ "--color": color });
  }, [color]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className="page">
      <h1 className="pageTitle">Créer une pièce</h1>

      <section className="section">
        <h2 className="sectionTitle">Informations</h2>

        <div className="form-group">
          <label className="label">Nom de la pièce</label>
          <input type="text" placeholder="Nom de la pièce" className="input" />
        </div>
        <div className="form-group">
          <label className="label">Couleur de la pièce</label>

          <label htmlFor="color" style={colorValue} className="colorPicker">
            <input
              type="color"
              id="color"
              onChange={(e) => {
                setColor(e.target.value);
              }}
              className="colorPickerInput"
            />
          </label>
        </div>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Ajouter des appareils à la pièce</h2>
        <InfoMessage
          type="warning"
          message="Certains appareils sont en attente d'être configurés, configurez les
          avant de pouvoir les assigner à une pièce"
        />
        <div className={styles.list}>
          <BoxSelector
            type="radio"
            id={1}
            name="Boite 1"
            selection={selection}
            setSelection={setSelection}
          />
          <BoxSelector
            type="radio"
            id={2}
            name="Boite 2"
            selection={selection}
            setSelection={setSelection}
          />
          <BoxSelector
            type="radio"
            id={3}
            name="Boite 3"
            selection={selection}
            setSelection={setSelection}
          />
        </div>
      </section>
      <section className="section">
        <button className="bigButton">Créer la pièce</button>
      </section>
    </main>
  );
};

export default CreateRoom;
