import LoginComponent from "../components/LoginComponent"
import { Link } from "react-router-dom"

export const LogInPage = () => {
  return (
    <div id="wrapper">
      <div className="login-form">
      <LoginComponent />
    </div>
    <p>Don't have an account? Register <Link to="/register">here</Link></p>
    </div>
  )
}
