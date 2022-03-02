import { useEffect } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CreateBuilding = () => {
  const { register, handleSubmit } = useForm();
  let navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = (formData) => {
    console.log(formData);
    api
      .post("/building/create/", formData)
      .then((res) => res.status === 200 && navigate("/rooms"));
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
              placeholder="Nom de l'appareil"
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
