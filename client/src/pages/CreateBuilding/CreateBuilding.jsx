import { useContext, useEffect } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import notificationContext from "../../contexts/notificationContext";

const CreateBuilding = () => {
  const { register, handleSubmit } = useForm();
  let navigate = useNavigate();

  const { setNotification } = useContext(notificationContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = (formData) => {
    console.log(formData);
    api
      .post("/building/create/", formData)
      .then((res) => {
        res.status === 200 && navigate("/rooms");
        res.status === 200 &&
          setNotification({
            show: true,
            type: "success",
            text: "Batiment créé avec succès !",
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
    <main className="reveal">
      <h1 className="pageTitle">Créer un nouveau batiment</h1>
      <section className="section">
        <h2 className="sectionTitle">Informations</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="label">Donnez un nom à votre batiment</label>
            <input
              type="text"
              {...register("name")}
              placeholder="Nom du batiment"
              className="input"
            />
          </div>
          <button type="submit" className="bigButton">
            Enregistrer
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateBuilding;
