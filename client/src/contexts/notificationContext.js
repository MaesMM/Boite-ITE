import React from "react";

export default React.createContext({
  notification: {
    show: false,
    type: "",
    text: "",
  },
  setNotification: (value) => {},
});
