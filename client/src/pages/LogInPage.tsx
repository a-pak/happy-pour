import LoginComponent from "../components/LoginComponent"
import { Link } from "react-router-dom"
import "./styles/Auth.css";
export const LogInPage = () => {
  return (
    <div className="wrapper">
      <LoginComponent />
      <p className="margin-bottom"> Don't have an account? Register <Link to="/register">here</Link></p>
    </div>
  )
}
