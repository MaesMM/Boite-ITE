import styles from "./CategorySelector.module.scss";

const CategorySelector = ({ categories, selected, setSelected }) => {
  return (
    <nav className={styles.categorySelector}>
      {categories &&
        categories.map((category) => {
          return (
            <div
              className={`${styles.category} ${
                selected === category[0] && styles.selected
              }`}
              onClick={() => setSelected(category[0])}
            >
              {category[1]}
            </div>
          );
        })}
    </nav>
  );
};

export default CategorySelector;
