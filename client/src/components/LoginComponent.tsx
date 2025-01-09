import {Form} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import LoginService from "../services/login";
/* Login form component for LoginPage.
* */
export const LoginComponent = () => {

    return (
        <form onSubmit={LoginService.login({formData.email.value, formData.password.value});}>
            <div>
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
            </div>
            <div>
                <input type="submit" value="Log in" />
            </div>
        </form>
    );
}