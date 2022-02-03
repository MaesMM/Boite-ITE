import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import DataCard from "../../components/shared/DataCard/DataCard";
import BoxCard from "../../components/shared/BoxCard/BoxCard";

import styles from "./Room.module.scss";

import { ReactComponent as Arrow } from "../../assets/icons/Arrow.svg";

import { useState } from "react";
import CategorySelector from "../../components/shared/CategorySelector/CategorySelector";
import LineChart from "../../components/shared/Chart/LineChart";

const Room = () => {
  const [box, setBox] = useState(null);
  const [category, setCategory] = useState("temperature");

  const [chartData, setChartData] = useState({
    labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],

    datasets: [
      {
        label: "My First dataset",
        fill: true,
        backgroundColor: "hsla(181, 60%, 50%, 0.1)",
        borderColor: "hsl(181, 60%, 50%)",
        data: [10, 21, 27, 19.5, 20, 22, 21],
        lineTension: 0.25,
      },
    ],
  });

  return (
    <main className="page">
      <h2 className="pageTitle">Salle Rouge</h2>
      <section className="section">
        <h2 className="sectionTitle">Informations</h2>
        <section className={styles.messages}>
          <InfoMessage
            type="error"
            title="Some critical error"
            message="Hey hey hey ! I'm a critical error !"
          />
          <InfoMessage
            type="success"
            title="You made it !"
            message="I don't know what but congrats I guess ?"
          />
          <InfoMessage
            type="warning"
            title="Warning: Low battery"
            message="Charge the box"
          />
          <InfoMessage
            type="info"
            title="Today's fact :"
            message={`You're pretty`}
          />
        </section>
      </section>
      <section className={styles.dataSection}>
        <h2 className="sectionTitle">Données :</h2>
        <div className="list">
          <DataCard type="plain" title="Relevés aujourd'hui" value="45" />
          <DataCard
            type="plain"
            title="Heure du dernier relevé"
            value="16:08"
          />
        </div>
        <div className={styles.categorySelector}>
          <CategorySelector
            categories={[
              ["temperature", "Température"],
              ["humidity", "Humidité"],
              ["pression", "Pression"],
              ["sound-level", "Niveau sonore"],
              ["lightning", "Luminosité"],
              ["gas", "Gaz"],
            ]}
            selected={category}
            setSelected={setCategory}
          />
        </div>

        {category === "temperature" && (
          <article className={`${styles.data} reveal`}>
            <DataCard title="Dernière température relevée" value="20°C" />

            <article className={styles.tracking}>
              <header className={styles.header}>
                <h2>Température °C</h2>
                <div className={styles.dateSelector}>
                  <Arrow className={styles.previous} />
                  <span className={styles.day}>Aujourd'hui</span>
                  <Arrow className={styles.next} />
                </div>
              </header>
              <div className="list">
                <DataCard
                  type="minTemp"
                  title="Température minimale"
                  value="15°C"
                />
                <DataCard
                  type="temperature"
                  title="Température moyenne"
                  value="22°C"
                />
                <DataCard
                  type="maxTemp"
                  title="Température maximale"
                  value="35°C"
                />
                <div className={styles.chart}>
                  <LineChart chartData={chartData} min={0} max={35} />
                </div>
              </div>
            </article>
          </article>
        )}
        {category === "humidity" && (
          <article className={`${styles.data} reveal`}>
            <DataCard title="Dernière humidité relevée" value="26%" />

            <article className={styles.tracking}>
              <header className={styles.header}>
                <h2>Humidité %</h2>
                <div className={styles.dateSelector}>
                  <Arrow className={styles.previous} />
                  <span className={styles.day}>Aujourd'hui</span>
                  <Arrow className={styles.next} />
                </div>
              </header>
              <div className="list">
                <DataCard
                  type="minTemp"
                  title="Humidité minimale"
                  value="20%"
                />
                <DataCard
                  type="temperature"
                  title="Humidité moyenne"
                  value="35%"
                />
                <DataCard
                  type="maxTemp"
                  title="Humidité maximale"
                  value="50%"
                />
                <div className={styles.chart}>
                  <LineChart chartData={chartData} min={0} max={35} />
                </div>
              </div>
            </article>
          </article>
        )}
        {category === "pression" && (
          <article className={`${styles.data} reveal`}>
            <DataCard title="Dernière pression relevée" value="994 hPa" />

            <article className={styles.tracking}>
              <header className={styles.header}>
                <h2>Pression hPa</h2>
                <div className={styles.dateSelector}>
                  <Arrow className={styles.previous} />
                  <span className={styles.day}>Aujourd'hui</span>
                  <Arrow className={styles.next} />
                </div>
              </header>
              <div className="list">
                <DataCard
                  type="minTemp"
                  title="Pression minimale"
                  value="968 hPa"
                />
                <DataCard
                  type="temperature"
                  title="Pression moyenne"
                  value="1003 hPa"
                />
                <DataCard
                  type="maxTemp"
                  title="Pression maximale"
                  value="1100 hPa"
                />
                <div className={styles.chart}>
                  <LineChart chartData={chartData} min={0} max={35} />
                </div>
              </div>
            </article>
          </article>
        )}
        {category === "sound-level" && (
          <article className={`${styles.data} reveal`}>
            <DataCard title="Dernier volume relevé" value="60 dB" />

            <article className={styles.tracking}>
              <header className={styles.header}>
                <h2>Niveau sonore dB</h2>
                <div className={styles.dateSelector}>
                  <Arrow className={styles.previous} />
                  <span className={styles.day}>Aujourd'hui</span>
                  <Arrow className={styles.next} />
                </div>
              </header>
              <div className="list">
                <DataCard type="minTemp" title="Niveau minimal" value="19 dB" />
                <DataCard
                  type="temperature"
                  title="Niveau moyen"
                  value="43 dB"
                />
                <DataCard type="maxTemp" title="Niveau maximal" value="72 dB" />
                <div className={styles.chart}>
                  <LineChart chartData={chartData} min={0} max={35} />
                </div>
              </div>
            </article>
          </article>
        )}
        {category === "lightning" && (
          <article className={`${styles.data} reveal`}>
            <DataCard title="Dernière luminosté relevée" value="1024 lux" />

            <article className={styles.tracking}>
              <header className={styles.header}>
                <h2>Luminosité lux</h2>
                <div className={styles.dateSelector}>
                  <Arrow className={styles.previous} />
                  <span className={styles.day}>Aujourd'hui</span>
                  <Arrow className={styles.next} />
                </div>
              </header>
              <div className="list">
                <DataCard
                  type="minTemp"
                  title="Luminosité minimale"
                  value="12 lux"
                />
                <DataCard
                  type="temperature"
                  title="Luminosité moyenne"
                  value="853 lux"
                />
                <DataCard
                  type="maxTemp"
                  title="Luminosité maximale"
                  value="2807 lux"
                />
                <div className={styles.chart}>
                  <LineChart chartData={chartData} min={0} max={35} />
                </div>
              </div>
            </article>
          </article>
        )}
        {category === "gas" && (
          <article className={`${styles.data} reveal`}>
            <DataCard title="Dernier taux de CO2 relevé" value="17%" />

            <div className="list">
              <DataCard type="good" title="Présence de CO" value="Non" />
              <DataCard type="good" title="Présence de Butane" value="Non" />
              <DataCard type="bad" title="Présence de Propane" value="Oui" />
            </div>
            <article className={styles.tracking}>
              <header className={styles.header}>
                <h2>Taux de CO2 %</h2>
                <div className={styles.dateSelector}>
                  <Arrow className={styles.previous} />
                  <span className={styles.day}>Aujourd'hui</span>
                  <Arrow className={styles.next} />
                </div>
              </header>
              <div className="list">
                <DataCard type="minTemp" title="Taux minimal" value="9%" />
                <DataCard type="temperature" title="Taux moyen" value="16%" />
                <DataCard type="maxTemp" title="Taux maximal" value="40%" />
                <div className={styles.chart}>
                  <LineChart chartData={chartData} min={0} max={35} />
                </div>
              </div>
            </article>
          </article>
        )}
      </section>
    </main>
  );
};

export default Room;
