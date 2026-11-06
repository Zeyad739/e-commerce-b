import { Component, useState, useCallback } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import NotificationContext from "./NotificationContext";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addNotification = useCallback((type, message, title) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = {
    success: (message, title = "Success") =>
      addNotification("success", message, title),
    error: (message, title = "Error") =>
      addNotification("danger", message, title),
    info: (message, title = "Information") =>
      addNotification("info", message, title),
    warning: (message, title = "Warning") =>
      addNotification("warning", message, title),
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-success me-2" size={18} />;
      case "danger":
        return <FaExclamationCircle className="text-danger me-2" size={18} />;
      case "warning":
        return <FaExclamationTriangle className="text-warning me-2" size={18} />;
      default:
        return <FaInfoCircle className="text-info me-2" size={18} />;
    }
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999, position: "fixed" }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => removeNotification(toast.id)}
            delay={4000}
            autohide
            className="shadow-lg border-0 mb-2"
          >
            <Toast.Header>
              {getIcon(toast.type)}
              <strong className="me-auto">{toast.title}</strong>
              <small className="text-muted">just now</small>
            </Toast.Header>
            <Toast.Body className="bg-body text-body">{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  );
}

// Error Boundary Component
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <div className="alert alert-danger p-4 shadow-sm rounded-4">
            <h4 className="alert-heading fw-bold">Something went wrong!</h4>
            <p className="text-muted">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              className="btn btn-outline-danger mt-3"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
