import { Link } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import "../../styles/LoginPage.css";

const Login = () => {
    return (
        <main className="login-page">

            <section className="login-container">

                <div className="login-header">
                    <span className="login-brand">Z66 BARBER</span>

                    <h1>Bienvenido</h1>

                    <p>
                        Iniciá sesión para reservar tu turno
                    </p>
                </div>

                <LoginForm />

                <div className="register-link">
                    <span>¿No tienes cuenta?</span>

                    <Link to="/register">
                        Registrate
                    </Link>
                </div>

            </section>

        </main>
    );
};

export default Login;
