import { useEffect } from "react";
import styles from "./Informations.module.scss";

const Informations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <main className="page">
      <h1 className="pageTitle">Informations</h1>
    </main>
  );
};

export default Informations;
