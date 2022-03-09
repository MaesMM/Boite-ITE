import InfoMessage from "../../components/shared/InfoMessage/InfoMessage";
import DataCard from "../../components/shared/DataCard/DataCard";
import BoxCard from "../../components/shared/BoxCard/BoxCard";

import styles from "./Room.module.scss";

import { ReactComponent as Delete } from "../../assets/icons/Delete.svg";
import { ReactComponent as Arrow } from "../../assets/icons/Arrow.svg";
import { ReactComponent as Check } from "../../assets/icons/Success.svg";

import { useContext, useEffect, useState } from "react";
import CategorySelector from "../../components/shared/CategorySelector/CategorySelector";
import LineChart from "../../components/shared/Chart/LineChart";
import Switch from "../../components/shared/Switch/Switch";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

import moment from "moment";
import refreshContext from "../../contexts/refreshContext";
import notificationContext from "../../contexts/notificationContext";
import { useForm } from "react-hook-form";

const Room = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [sampling, setSampling] = useState(false);
  const [category, setCategory] = useState({});
  const [roomData, setRoomData] = useState(null);
  const [isTouched, setIsTouched] = useState(false);

  const [timeChanged, setTimeChanged] = useState(false);

  const [boxList, setBoxList] = useState([]);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);

  const onlyNumbers = (e) => {
    !timeChanged && setTimeChanged(true);
    e.target.value = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
  };

  useEffect(() => {
    api.get("/data-type/all/").then((res) => {
      setCategories(res.data);
      setCategory(res.data.find((el) => el.name === "temperature"));
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/room/${uuid}/`).then((res) => {
      setRoomData(res.data);
      setBoxList(res.data.boxes);
    });
  }, [uuid]);

  useEffect(() => {
    roomData && setSampling(roomData.state);
  }, [roomData]);

  useEffect(() => {
    roomData &&
      isTouched &&
      api.patch(`/room/update/${uuid}/`, { state: sampling });
  }, [sampling]);

  useEffect(() => {
    let box = boxList.find((box) => box.mac === selectedBox);

    console.log(box);
    box &&
      api.get(`/data/get/${box.uuid}/today/`).then((res) => {
        setData(res.data);
      });

    box &&
      api.get(`/data/get/${box.uuid}/latest/`).then((res) => {
        setLast(res.data);
      });
  }, [selectedBox]);

  const [chartData, setChartData] = useState({
    labels: ["--", "--"],

    datasets: [
      {
        label: "--",
        fill: true,
        backgroundColor: "hsla(181, 60%, 50%, 0.1)",
        borderColor: "hsl(181, 60%, 50%)",
        data: [10, 10],
        lineTension: 0.25,
      },
    ],
  });

  useEffect(() => {
    data &&
      category &&
      setSelectedvalues(
        data
          .filter((data) => {
            if (data.data_type === category.id) return true;
            else return false;
          })
          .map((data) => {
            return data.value;
          })
      );

    data &&
      data.length > 0 &&
      category &&
      setChartData({
        labels: data
          .filter((data) => {
            if (data.data_type === category.id) return true;
            else return false;
          })
          .map((data) => {
            return moment(data.created_at).format("HH:mm");
          }),

        datasets: [
          {
            label: category.display_name,
            fill: true,
            backgroundColor: "hsla(181, 60%, 50%, 0.1)",
            borderColor: "hsl(181, 60%, 50%)",
            data: data
              .filter((data) => {
                if (data.data_type === category.id) return true;
                else return false;
              })
              .map((data) => {
                return data.value;
              }),
            lineTension: 0.25,
          },
        ],
      });
  }, [data, category]);

  const [selectedValues, setSelectedvalues] = useState([]);

  const average = (arr) => {
    return arr.reduce((a, b) => parseInt(a) + parseInt(b), 0) / arr.length;
  };

  const { refresh, setRefresh } = useContext(refreshContext);
  const { setNotification } = useContext(notificationContext);

  const handleDelete = () => {
    if (uuid) {
      if (
        window.confirm(
          "Êtes-vous sûr de vouloir supprimer cette pièce ? Cela entrainera l'oubli des boîtes qui y sont assignées"
        )
      ) {
        api
          .delete(`/room/${uuid}/delete/`)
          .then((res) => {
            res.status === 200 && setRefresh(!refresh);
            navigate("/rooms");
          })
          .then((res) => {
            res.status === 200 && navigate("/devices");
            res.status === 200 &&
              setNotification({
                show: true,
                type: "success",
                text: "Salle supprimée avec succès !",
              });
          })
          .catch(() => {
            setNotification({
              show: true,
              type: "error",
              text: "Une erreur est survenue",
            });
          });
      }
    }
  };

  const { register, handleSubmit, getValues } = useForm();

  const onSubmit = () => {
    let hours = parseInt(getValues("hours"));
    let minutes = parseInt(getValues("minutes"));
    let seconds = parseInt(getValues("seconds"));

    let hoursInSec = hours * 3600;
    let minutesInSec = minutes * 60;

    let totalInMilliseconds = (hoursInSec + minutesInSec + seconds) * 1000;

    api.patch(`/box/update/${selectedBox}/`, {
      collect_frequency: totalInMilliseconds,
    });
    setTimeChanged(false);
  };

  useEffect(() => console.log(selectedBox), [selectedBox]);

  return (
    <main>
      <header className={styles.pageHead}>
        <div className={`row ${styles.headRow}`}>
          <div className={`row ${styles.topRow}`}>
            <div
              className={styles.color}
              style={{
                "--color": roomData ? roomData.color : "#000",
              }}
            ></div>
            <h2 className="pageTitle">{roomData && roomData.name}</h2>
          </div>
          <Switch
            styling="bigSwitch"
            touched={isTouched}
            setTouched={setIsTouched}
            state={sampling}
            setState={setSampling}
          />
        </div>
        <div className={styles.delete} onClick={handleDelete}>
          <Delete />
        </div>
      </header>
      {boxList.length > 0 ? (
        <section className="section">
          <h2 className="sectionTitle">Sélectionnez une boite</h2>
          <div className={`row wrap ${styles.row}`}>
            {boxList.map((box, index) => {
              console.log(index + " : " + box.uuid);
              return (
                <BoxCard
                  key={box.mac}
                  boxUuid={box.uuid}
                  name={box.name}
                  type="selection"
                  selectedBox={selectedBox}
                  setSelectedBox={setSelectedBox}
                />
              );
            })}

            {console.log("\n")}
          </div>
        </section>
      ) : (
        <InfoMessage
          type="warning"
          title="Aucune boite n'est assignée à cette pièce"
          message='Vous pouvez en assigner une dans la section "pièce" de l&apos;application'
        />
      )}
      {selectedBox && (
        <div className="reveal">
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
          <section>
            <h2 className="sectionTitle">Relevés</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="form-group">
              <label className="label">Intervale de relevés</label>
              <div className={styles.intervalRow}>
                <div className="input timeInput">
                  <input
                    {...register("hours")}
                    type="text"
                    defaultValue={
                      boxList.find((box) => (box.uuid = selectedBox)) &&
                      boxList.find((box) => (box.uuid = selectedBox))
                        .collect_frequency &&
                      Math.floor(
                        (boxList.find((box) => (box.uuid = selectedBox))
                          .collect_frequency /
                          (1000 * 60 * 60)) %
                          24
                      )
                    }
                    onChange={(e) => onlyNumbers(e)}
                    maxLength={2}
                  />
                  <span>h</span>
                  <input
                    {...register("minutes")}
                    type="text"
                    defaultValue={
                      boxList.find((box) => (box.uuid = selectedBox)) &&
                      boxList.find((box) => (box.uuid = selectedBox))
                        .collect_frequency &&
                      Math.floor(
                        (boxList.find((box) => (box.uuid = selectedBox))
                          .collect_frequency /
                          (1000 * 60)) %
                          60
                      )
                    }
                    maxLength={2}
                    onChange={(e) => onlyNumbers(e)}
                  />
                  <span>min</span>
                  <input
                    {...register("seconds")}
                    type="text"
                    defaultValue={
                      boxList.find((box) => (box.uuid = selectedBox)) &&
                      boxList.find((box) => (box.uuid = selectedBox))
                        .collect_frequency &&
                      Math.floor(
                        (boxList.find((box) => (box.uuid = selectedBox))
                          .collect_frequency /
                          1000) %
                          60
                      )
                    }
                    maxLength={2}
                    onChange={(e) => onlyNumbers(e)}
                  />
                  <span>sec</span>
                </div>
                {timeChanged && (
                  <button
                    type="submit"
                    className={`${styles.intervalBtn} reveal`}
                  >
                    <Check />
                  </button>
                )}
              </div>
            </form>
            <div className="list">
              <DataCard
                type="plain"
                title="Relevés aujourd'hui"
                value={data ? data.length : "--"}
              />
              <DataCard
                type="plain"
                title="Heure du dernier relevé"
                value={
                  last && last.length > 0
                    ? moment(last[0].created_at).format("HH:mm")
                    : "--"
                }
              />
            </div>
            <section className={styles.dataSection}>
              <h2 className="sectionTitle">Données</h2>
              <div className={styles.categorySelector}>
                <CategorySelector
                  categories={categories.length > 0 && categories}
                  selected={category}
                  setSelected={setCategory}
                />
              </div>

              {category && (
                <article className={`${styles.data} reveal`}>
                  <DataCard
                    title="Dernier relevé"
                    value={`${
                      last &&
                      last.filter((data) => {
                        if (data.data_type === category.id) return true;
                        else return false;
                      }).length > 0 &&
                      last.filter((data) => {
                        if (data.data_type === category.id) return true;
                        else return false;
                      })[0].value
                        ? last.filter((data) => {
                            if (data.data_type === category.id) return true;
                            else return false;
                          })[0].value
                        : "--"
                    } ${category.unit}`}
                  />
                  {category.name === "gas" && (
                    <div className="list">
                      <DataCard
                        type="good"
                        title="Présence de CO"
                        value="Non"
                      />
                      <DataCard
                        type="good"
                        title="Présence de Butane"
                        value="Non"
                      />
                      <DataCard
                        type="bad"
                        title="Présence de Propane"
                        value="Oui"
                      />
                    </div>
                  )}

                  <article className={styles.tracking}>
                    <header className={styles.header}>
                      <h2>{`${category.display_name} ${category.unit}`}</h2>
                      <div className={styles.dateSelector}>
                        <Arrow className={styles.previous} />
                        <span className={styles.day}>Aujourd'hui</span>
                        <Arrow className={styles.next} />
                      </div>
                    </header>
                    <div className="list">
                      <DataCard
                        type="minTemp"
                        title={`${category.display_name} min`}
                        value={`${
                          selectedValues.length > 0
                            ? Math.min(...selectedValues).toFixed(1)
                            : "--"
                        } ${category.unit}`}
                      />
                      <DataCard
                        type="temperature"
                        title="Température moyenne"
                        value={`${
                          selectedValues.length > 0
                            ? average(selectedValues).toFixed(1)
                            : "--"
                        } ${category.unit}`}
                      />
                      <DataCard
                        type="maxTemp"
                        title={`${category.display_name} max`}
                        value={`${
                          selectedValues.length > 0
                            ? Math.max(...selectedValues).toFixed(1)
                            : "--"
                        } ${category.unit}`}
                      />
                      <div className={styles.chart}>
                        <LineChart
                          chartData={chartData}
                          min={Math.min(...selectedValues) - 2}
                          max={Math.max(...selectedValues) + 2}
                        />
                      </div>
                    </div>
                  </article>
                </article>
              )}
            </section>
            {/*category === 4 && (
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
                      value={Math.min(...selectedValues) + " %"}
                    />
                    <DataCard
                      type="temperature"
                      title="Humidité moyenne"
                      value={average(selectedValues).toFixed(1) + " %"}
                    />
                    <DataCard
                      type="maxTemp"
                      title="Humidité maximale"
                      value={Math.max(...selectedValues) + " %"}
                    />
                    <div className={styles.chart}>
                      <LineChart
                        chartData={chartData}
                        min={Math.min(...selectedValues) - 2}
                        max={Math.max(...selectedValues) + 2}
                      />
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
                    <DataCard
                      type="minTemp"
                      title="Niveau minimal"
                      value="19 dB"
                    />
                    <DataCard
                      type="temperature"
                      title="Niveau moyen"
                      value="43 dB"
                    />
                    <DataCard
                      type="maxTemp"
                      title="Niveau maximal"
                      value="72 dB"
                    />
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
                    <DataCard
                      type="temperature"
                      title="Taux moyen"
                      value="16%"
                    />
                    <DataCard type="maxTemp" title="Taux maximal" value="40%" />
                    <div className={styles.chart}>
                      <LineChart chartData={chartData} min={0} max={35} />
                    </div>
                  </div>
                </article>
              </article>
            )*/}
          </section>
        </div>
      )}
    </main>
  );
};

export default Room;
