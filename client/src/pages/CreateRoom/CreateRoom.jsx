import styles from "./CreateRoom.module.scss";

import { useContext, useEffect, useState } from "react";
import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import BoxSelector from "../../components/shared/Selector/Selector";

import { useForm } from "react-hook-form";

import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import notificationContext from "../../contexts/notificationContext";

const CreateRoom = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm();

  const [color, setColor] = useState("#33c9cc");
  const [selection, setSelection] = useState([]);

  const [colorValue, setColorValue] = useState(null);

  const [boxes, setBoxes] = useState([]);
  const [newBoxes, setNewBoxes] = useState([]);

  const { setNotification } = useContext(notificationContext);

  useEffect(() => {
    setColorValue({ "--color": color });
  }, [color]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/boxes/not-assigned/`).then((res) => {
      setBoxes(res.data);
    });
    api.get(`/boxes/new/`).then((res) => {
      setNewBoxes(res.data);
    });
  }, []);

  const onSubmit = (formData) => {
    let dataToPass = { ...formData };

    if (selection.length > 0) {
      let boxes = [];

      selection.forEach((selection) => boxes.push(selection));
      dataToPass = { ...formData, boxes };
    }

    api
      .post("/room/create/", dataToPass)
      .then((res) => {
        res.status === 200 && navigate("/rooms");
        res.status === 200 &&
          setNotification({
            show: true,
            type: "success",
            text: "Salle créée avec succès !",
          });
      })
      .catch(() => {
        setNotification({
          show: true,
          type: "error",
          text: "Une erreur est survenue",
        });
      });
  };

  return (
    <main>
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
                value="#33c9cc"
                onChange={(e) => {
                  setValue("color", e.target.value);
                  setColor(e.target.value);
                }}
                className="colorPickerInput"
              />
            </label>
          </div>
        </section>
        {boxes.length > 0 && (
          <section className="section">
            <h2 className="sectionTitle">Ajouter des appareils à la pièce</h2>

            {newBoxes.length > 0 && (
              <InfoMessage
                type="warning"
                message="Certains appareils sont en attente d'être configurés, configurez les
          avant de pouvoir les assigner à une pièce"
              />
            )}
            <div className={styles.list}>
              {boxes.map((box) => {
                return (
                  <BoxSelector
                    key={box.uuid}
                    type="checkbox"
                    id={box.uuid}
                    name={box.name}
                    selection={selection}
                    setSelection={setSelection}
                  />
                );
              })}
            </div>
          </section>
        )}
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
