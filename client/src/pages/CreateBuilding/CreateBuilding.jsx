import { useEffect, useState } from "react";

const CreateBuilding = () => {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page">
      <h1 className="pageTitle">Créer un nouveau batiment</h1>
      <section className="section">
        <h2 className="sectionTitle">Informations</h2>
        <div className="form-group">
          <label className="label">Donnez un nom à votre batiment</label>
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

export default CreateBuilding;
