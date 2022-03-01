import styles from "./Selector.module.scss";

import { ReactComponent as Success } from "../../../assets/icons/Success.svg";
import { useEffect, useState } from "react";
import api from "../../../services/api";

const Selector = ({ id, building, type, name, selection, setSelection }) => {
  const [buildingName, setBuildingName] = useState(null);

  const handleCheck = () => {
    if (selection.includes(id)) {
      let newArray = [];
      selection.reduce((boxID) => {
        if (boxID !== id) {
          newArray.push(boxID);
        }
        return boxID;
      });
      setSelection(newArray);
    } else {
      let newArray = [...selection];
      newArray.push(id);
      console.log(newArray);
      setSelection(newArray);
    }
  };

  const handleSelect = () => {
    if (selection !== id) {
      setSelection(id);
    } else {
      setSelection(null);
    }
  };

  useEffect(() => {
    building &&
      api
        .get(`/building/${building}/`)
        .then((res) => setBuildingName(res.data.name));
  }, [building]);

  return (
    <article
      className={styles.container}
      onClick={() => {
        if (type === "checkbox") handleCheck();
        if (type === "radio") handleSelect();
      }}
    >
      <div
        className={`${styles.checkbox} 
        ${
          ((type === "checkbox" && selection.includes(id)) ||
            (type === "radio" && selection === id)) &&
          styles.checked
        }
        `}
      >
        {type === "checkbox" && <Success className={styles.icon} />}
        {type === "radio" && <div className={styles.point}></div>}
      </div>
      <div className={styles.column}>
        <div className={styles.name}>{name}</div>
        {buildingName && <div className={styles.subname}>{buildingName}</div>}
      </div>
    </article>
  );
};

export default Selector;
