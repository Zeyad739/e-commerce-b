import { useContext } from "react";
import NotificationContext from "./NotificationContext";

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      success: (msg) => console.log("SUCCESS:", msg),
      error: (msg) => console.error("ERROR:", msg),
      info: (msg) => console.info("INFO:", msg),
      warning: (msg) => console.warn("WARNING:", msg),
    };
  }
  return context;
}
