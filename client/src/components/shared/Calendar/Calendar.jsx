import { useState, useEffect } from "react";

import { ReactComponent as Arrow } from "../../../assets/icons/Arrow.svg";

import styles from "./calendar.module.scss";
import {
  buildCalendar,
  prevMonth,
  thisMonth,
  nextMonth,
  currYear,
  currMonthName,
  beforeToday,
} from "./calendarLogic";

const Calendar = ({ value, onChange }) => {
  const [calendar, setCalendar] = useState([]);

  const monthStartDay = value.clone().startOf("month");
  const monthEndDay = value.clone().endOf("month");

  useEffect(() => {
    setCalendar(buildCalendar(value));
  }, [value]);

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <div
          className={thisMonth(value) && styles.hidden}
          onClick={() => !thisMonth(value) && onChange(prevMonth(value))}
        >
          <Arrow />
        </div>
        <div className={styles.current}>
          {currMonthName(value)} {currYear(value)}
        </div>
        <div
          className={styles.right}
          onClick={() => onChange(nextMonth(value))}
        >
          <Arrow />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.week}>
          <div className={`${styles.day} ${styles.dayName}`}>Lun</div>
          <div className={`${styles.day} ${styles.dayName}`}>Mar</div>
          <div className={`${styles.day} ${styles.dayName}`}>Mer</div>
          <div className={`${styles.day} ${styles.dayName}`}>jeu</div>
          <div className={`${styles.day} ${styles.dayName}`}>Ven</div>
          <div className={`${styles.day} ${styles.dayName}`}>Sam</div>
          <div className={`${styles.day} ${styles.dayName}`}>Dim</div>
        </div>
        {calendar.map((week) => (
          <div key={week} className={styles.week}>
            {week.map((day) => (
              <div
                key={day}
                className={`${styles.day} ${
                  value.isSame(day) && styles.selected
                } 
              ${day.isSame(new Date(), "day") && styles.isToday} ${
                  (day.isBefore(monthStartDay, "day") ||
                    day.isAfter(monthEndDay, "day") ||
                    beforeToday(day)) &&
                  styles.isNotSelectable
                }`}
                onClick={() => !beforeToday(day) && onChange(day, "day")}
              >
                {day.format("D")}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
