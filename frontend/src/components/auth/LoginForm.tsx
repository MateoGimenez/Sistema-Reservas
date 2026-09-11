import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../auth/loginForm.css";

const LoginForm = () => {
  const [type, setType] = useState("password");

  const togglePasswordVisibility = () => {
    setType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  return (
    <form className="login-form">

      <div className="form-group">
        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          className="email"
          placeholder="Ingresá tu email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>

        <div className="container-password">
          <input
            id="password"
            type={type}
            className="password"
            placeholder="Ingresá tu contraseña"
            required
          />

          <button
            type="button"
            className="show-password"
            onClick={togglePasswordVisibility}
            aria-label={
              type === "password"
                ? "Mostrar contraseña"
                : "Ocultar contraseña"
            }
          >
            {type === "password" ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </div>

      <button type="submit" className="login-button">
        Iniciar sesión
      </button>

    </form>
  );
};

export default LoginForm;