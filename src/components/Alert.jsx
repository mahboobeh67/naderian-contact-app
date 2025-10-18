import React, { useEffect } from "react";
import styles from "./Alert.module.css";

function Alert({ type = "info", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span>{message}</span>
    </div>
  );
}

export default Alert;