import LoginComponent from "../components/LoginComponent"
import { Link, useLocation } from "react-router-dom"
import { useErrorStore } from "../store/errorStore.ts";
import { useEffect } from "react";

export const LogInPage = () => {
  const location = useLocation();
  const {showNotification} = useErrorStore.getState();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get("message");

    switch (message) {
      case "register-success":
        showNotification("Registration successful!\nYou can now log in.", "success");
        break;
      case "register-fail":
        showNotification("Registration failed.\nThe link was expired.", "error");
        break;
      case "unauthorized":
        showNotification("Please log in first.", "warning");
        break;
      case "check-email":
        showNotification("Check your email for the verification link.", "info");
        break;
      default:
        break;
    }
  }, [location.search]);

  return (
    <div className="wrapper">
      <LoginComponent />
      <p className="margin-bottom"> Don't have an account? Register <Link to="/register">here</Link></p>
    </div>
  )
}
