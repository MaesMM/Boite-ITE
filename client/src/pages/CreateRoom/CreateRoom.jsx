import styles from "./CreateRoom.module.scss";

import { useEffect, useState } from "react";
import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import BoxSelector from "../../components/shared/Selector/Selector";

import { useForm } from "react-hook-form";
import axios from "axios";
import api from "../../services/api";
import { useParams } from "react-router-dom";

const CreateRoom = () => {
  const { uuid } = useParams();

  const { register, handleSubmit, setValue } = useForm();

  const [color, setColor] = useState("#33c9cc");
  const [selection, setSelection] = useState([]);

  const [colorValue, setColorValue] = useState(null);

  useEffect(() => {
    setColorValue({ "--color": color });
  }, [color]);

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(uuid);
  }, []);

  const onSubmit = (formData) => {
    api.post("/rooms/", formData).then((res) => console.log(res));
  };

  return (
    <main className="page">
      <h1 className="pageTitle">Créer une pièce</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="section">
          <h2 className="sectionTitle">Informations</h2>
          <input {...register("building")} value={uuid} type="hidden" />
          <div className="form-group">
            <label className="label">Nom de la pièce</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Nom de la pièce"
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="label">Couleur de la pièce</label>

            <label htmlFor="color" style={colorValue} className="colorPicker">
              <input
                {...register("color")}
                type="color"
                id="color"
                onChange={(e) => {
                  setValue("color", e.target.value);
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
          <button type="submit" className="bigButton">
            Créer la pièce
          </button>
        </section>
      </form>
    </main>
  );
};

export default CreateRoom;
