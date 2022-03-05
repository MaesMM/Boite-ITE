import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import notificationContext from "../../contexts/notificationContext";
import api from "../../services/api";

const CreateDevice = () => {
  const { uuid } = useParams();
  let navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const { setNotification } = useContext(notificationContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = (formData) => {
    api
      .patch(`/box/update/${uuid}/`, formData)
      .then((res) => {
        console.log(res);
        res.status === 200 && navigate("/devices");
        res.status === 200 &&
          setNotification({
            show: true,
            type: "success",
            text: "Appareil créé avec succès !",
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
      <h1 className="pageTitle">Configurer un nouvel appareil</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="section">
          <h2 className="sectionTitle">Informations</h2>
          <div className="form-group">
            <label className="label">Donnez un nom à votre appareil</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Nom de l'appareil"
              className="input"
            />
          </div>
        </section>
        <button type="submit" className="bigButton">
          Enregistrer
        </button>
      </form>
    </main>
  );
};

export default CreateDevice;
