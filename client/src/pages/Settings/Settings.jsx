import styles from "./Settings.module.scss";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import DeletePopup from "../../components/shared/deletePopup/DeletePopup";

const Settings = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (formData) => console.log(formData);

  const [data, setData] = useState(null);

  const [isShown, setIsShown] = useState(false);

  const handleDelete = () => {
    console.log("delete");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    //someApiCall
  }, []);

  return (
    <main>
      <h1 className="pageTitle">Paramètres</h1>
      <section className="section">
        <h2 className="sectionTitle">Votre compte</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`column ${styles.column}`}
        >
          <div className={`form-group ${styles.formGroup}`}>
            <label className="label">Nom et prénom</label>
            <div className={`row ${styles.row}`}>
              <input
                defaultValue={data ? data.lastName : ""}
                {...register("lastName")}
                className="input"
                placeholder="Nom"
              />
              <input
                defaultValue={data ? data.firstName : ""}
                {...register("firstName")}
                className="input"
                placeholder="Prénom"
              />
            </div>
          </div>
          <div className={`form-group ${styles.formGroup}`}>
            <label className="label">Adresse email</label>
            <input
              defaultValue={data ? data.email : ""}
              {...register("email")}
              className="input full-width"
              type="mail"
              placeholder="Email"
            />
          </div>
          <div className={`form-group ${styles.formGroup}`}>
            <label className="label">Modifier le mot de passe</label>
            <input
              {...register("currentPassword")}
              className="input full-width"
              placeholder="Mot de passe actuel"
            />
            <input
              {...register("newPassword")}
              className="input full-width"
              placeholder="Nouveau mot de passe"
            />
            <input
              {...register("confirmNewPassword")}
              className="input full-width"
              placeholder="Confirmer nouveau mot de passe"
            />
          </div>
          <button type="submit" className="button">
            Modifier
          </button>
        </form>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Action sur votre compte</h2>
        <div className={`row ${styles.row}`}>
          <div className="button">Se déconnecter</div>
          <button
            className="button outlined-error"
            onClick={() => setIsShown(true)}
          >
            Supprimer le compte
          </button>
        </div>
      </section>

      {isShown && (
        <DeletePopup
          textToWrite="Supprimer le compte définitivement"
          callback={handleDelete}
        />
      )}
    </main>
  );
};

export default Settings;
