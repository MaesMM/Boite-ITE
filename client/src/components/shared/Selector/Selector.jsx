import styles from "./Selector.module.scss";

import { ReactComponent as Success } from "../../../assets/icons/Success.svg";

const Selector = ({ id, type, name, selection, setSelection }) => {
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
    }
  };

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
      <div className={styles.name}>{name}</div>
    </article>
  );
};

export default Selector;
