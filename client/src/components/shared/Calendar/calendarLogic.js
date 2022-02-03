export function buildCalendar(value) {
    const startDay = value.clone().startOf("month").startOf("week");
    const endDay = value.clone().endOf("month").endOf("week");
  
    const a = [];
    const day = startDay.clone().subtract(1, "day");
  
    while (day.isBefore(endDay, "day")) {
      a.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone())
      );
    }
  
    return a;
  }
  
  export const beforeToday = (day) => {
    return day.isBefore(new Date(), "day");
  };
  
  export const currYear = (value) => {
    return value.format("YYYY");
  };
  
  export const prevMonth = (value) => {
    return value.clone().subtract(1, "month");
  };
  
  export const thisMonth = (value) => {
    return value.isSame(new Date(), "month");
  };
  
  export const nextMonth = (value) => {
    return value.clone().add(1, "month");
  };
  
  export const currMonthName = (value) => {
    let month = value.format("MMMM");
    return month[0].toUpperCase() + month.substring(1); // Ajoute une maj à la première lettre
  };
  