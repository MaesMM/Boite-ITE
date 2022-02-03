import styles from "./DataCard.module.scss";

const DataCard = ({ type, title, value }) => {
  return (
    <article
      className={`${styles.container} ${styles[type]} 
      ${!type && styles.plain}
      ${type === "alerts" && (value >= 1 ? styles.bad : styles.good)}`}
    >
      <h2 className={styles.title}>{title}</h2>
      <span className={styles.value}>{value}</span>
    </article>
  );
};

export default DataCard;
