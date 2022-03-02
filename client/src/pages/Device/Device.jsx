import Selector from "../../components/shared/Selector/Selector";

import styles from "./Device.module.scss";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const Device = () => {
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const { uuid } = useParams();

  let navigate = useNavigate();

  const [data, setData] = useState(null);

  const { register, handleSubmit } = useForm();

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
    api.post(`/box/assign/${uuid}/`, { room: room }).then((res) => {
      res.status === 200 && navigate("/devices");
    });
  };
  const handleUpdate = (formData) => {
    api.patch(`/box/update/${uuid}/`, formData);
  };
  const handleUnpair = () => {
    api.get(`/box/unpair/${uuid}/`).then((res) => {
      res.status === 200 && navigate("/devices");
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

      {rooms.length > 0 && (
        <section className="section">
          <h2 className="sectionTitle">Pièce</h2>
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
          <button type="submit" onClick={handleAssignement} className="button">
            Assigner
          </button>
        </section>
      )}
      <section className="section">
        <h2 className="sectionTitle">Actions sur votre appareil</h2>
        <div className="row">
          <div onClick={handleUnpair} className="bigButton errorButton">
            Dissocier l'appareil
          </div>
        </div>
      </section>
    </main>
  );
};

export default Device;
