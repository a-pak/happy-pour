import LoginComponent from "../components/LoginComponent"
import { Link, useParams } from "react-router-dom"
import "./styles/Auth.css";
import { useErrorStore } from "../store/errorStore.ts";

export const LogInPage = () => {
  const { message } = useParams<{ message: string }>();
  const {showNotification} = useErrorStore.getState();
  message ? showNotification(message, "success") : null;
  
  return (
    <div className="wrapper">
      <LoginComponent />
      <p className="margin-bottom"> Don't have an account? Register <Link to="/register">here</Link></p>
    </div>
  )
}
