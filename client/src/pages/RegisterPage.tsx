import { Link } from 'react-router-dom';
import RegisterComponent from '../components/RegisterComponent';
const RegisterPage: React.FC = () => {
    return (

        <div className="wrapper">
            <RegisterComponent />
            <p className="margin-bottom">Already have an account? Login <Link to="/login">here</Link></p>
        </div>

    );
}

export default RegisterPage;