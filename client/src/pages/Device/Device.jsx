import Selector from "../../components/shared/Selector/Selector";

import styles from "./Device.module.scss";
import { useForm } from "react-hook-form";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import notificationContext from "../../contexts/notificationContext";
import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";

const Device = () => {
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const { uuid } = useParams();

  let navigate = useNavigate();

  const [data, setData] = useState(null);

  const { register, handleSubmit } = useForm();

  const { setNotification } = useContext(notificationContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    api
      .get(`/box/${uuid}/`)
      .then((res) => res.status === 200 && setData(res.data));
    api.get(`/rooms/`).then((res) => {
      res.status === 200 && setRooms(res.data);
      return res;
    });
  }, [uuid]);

  const handleAssignement = () => {
    api
      .post(`/box/assign/${uuid}/`, { room: room })
      .then((res) => {
        res.status === 200 && navigate("/devices");
        res.status === 200 &&
          setNotification({
            show: true,
            type: "success",
            text: "Appareil associé avec succès !",
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
  const handleUpdate = (formData) => {
    api
      .patch(`/box/update/${uuid}/`, formData)
      .then((res) => {
        res.status === 200 && navigate("/devices");
        res.status === 200 &&
          setNotification({
            show: true,
            type: "success",
            text: "Appareil modifié succès !",
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
  const handleUnpair = () => {
    api
      .get(`/box/unpair/${uuid}/`)
      .then((res) => {
        res.status === 200 && navigate("/devices");
        res.status === 200 &&
          setNotification({
            show: true,
            type: "success",
            text: "Appareil oublié avec succès !",
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

  useEffect(() => {
    data && setRoom(data.room);
  }, [data]);

  return (
    <main>
      <div className="head">
        <h1 className="pageTitle">{data && data.name}</h1>
      </div>
      <section className="section">
        <form onSubmit={handleSubmit(handleUpdate)}>
          <h2 className="sectionTitle">Informations</h2>
          <div className="form-group">
            <label className="label">Nom</label>
            <input
              defaultValue={data && data.name}
              {...register("name")}
              type="text"
              className="input"
              placeholder="Nom de l'appareil"
            />
          </div>
          <button type="submit" className="button">
            Modifier
          </button>
        </form>
      </section>

      <section className="section">
        <h2 className="sectionTitle">Pièce</h2>
        {rooms.length > 0 ? (
          <>
            <div className={`form-group ${styles.list}`}>
              {rooms.map((instance) => {
                return (
                  <Selector
                    type="radio"
                    key={instance.uuid}
                    name={instance.name}
                    id={instance.uuid}
                    building={instance.building}
                    selection={room}
                    setSelection={setRoom}
                  />
                );
              })}
            </div>
            <button
              type="submit"
              onClick={handleAssignement}
              className="button"
            >
              Assigner
            </button>
          </>
        ) : (
          <InfoMessage
            type="warning"
            title="Vous n'avez pas créé de pièce"
            message="Cet appareil ne peut être assigné à aucune pièce"
          />
        )}
      </section>
      <section className="section">
        <h2 className="sectionTitle">Actions sur votre appareil</h2>
        <div className="row">
          <div onClick={handleUnpair} className="bigButton errorButton">
            Oublier l'appareil
          </div>
        </div>
      </section>
    </main>
  );
};

export default Device;
