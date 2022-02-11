import { useEffect } from "react";
import BoxCard from "../../components/shared/BoxCard/BoxCard";
import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";

const Devices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <main className="page">
      <h1 className="pageTitle">Vos appareils</h1>
      <section className="section">
        <h2 className="sectionTitle">Nouvelles connexions</h2>
        <InfoMessage
          type="warning"
          title="Nouveaux appareils en attente"
          message="Une ou plusieurs boites se sont connectées à votre serveur et sont en attente d'être configurées"
        />
        <div className="list">
          <BoxCard type="configuration" macAddress="24:65:23:46:89" />
          <BoxCard type="configuration" macAddress="24:65:23:46:89" />
          <BoxCard type="configuration" macAddress="24:65:23:46:89" />
        </div>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Vos appareils</h2>
        <div className="list">
          <BoxCard type="link" name="Boite 1" link="/devices/id" />
          <BoxCard type="link" name="Boite 2" link="/devices/id" />
          <BoxCard type="link" name="Boite 3" link="/devices/id" />
        </div>
      </section>
    </main>
  );
};

export default Devices;
