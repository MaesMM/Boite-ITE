import { useEffect } from "react";
import styles from "./CategorySelector.module.scss";

const CategorySelector = ({ categories, selected, setSelected }) => {
  return (
    <nav className={styles.categorySelector}>
      {categories &&
        categories.map((category) => {
          return (
            <div
              key={category.id}
              className={`${styles.category} ${
                selected === category && styles.selected
              }`}
              onClick={() => {
                setSelected(category);
              }}
            >
              {category.display_name}
            </div>
          );
        })}
    </nav>
  );
};

export default CategorySelector;
