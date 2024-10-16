import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import axios from "axios";
import Swal from 'sweetalert2';
import "./App.scss";

function App() {
  const navigate = useNavigate();
  const { setUser, loginUser } = useAuth();
  const [values, setValues] = useState({
    userOrEmail: "", // Se fusionan user y correo en un solo campo
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`https://backendpaginaqr-production.up.railway.app/ingreso`, {
        userOrEmail: values.userOrEmail, // Solo enviamos un campo
        password: values.password,
      });
      if (response.data.message === "Código verificado correctamente.") {
        handleLoginSuccess(response.data);
      } else {
        console.log("Mensaje no esperado:", response.data.message);
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      if (error.response) {
        const { Message } = error.response.data;
        if (Message === "Ya posee una sesión activa") {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ya posee una sesión activa.',
          });
        } else if (Message === "Cuenta bloqueada. Intente de nuevo más tarde.") {
          Swal.fire({
            icon: 'error',
            title: 'Usuario Bloqueado',
            text: 'Cuenta bloqueada. Intente de nuevo más tarde.',
          });
        } else if (Message === "Credenciales inválidas") {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Credenciales inválidas',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: Message || "Credenciales inválidas",
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al intentar iniciar sesión. Por favor, inténtelo de nuevo.',
        });
      }
    }
  };

  //obteción del token, rol y usuario
  const handleLoginSuccess = (userData) => {
    const base64Payload = userData.token.split(".")[1];
    const payload = atob(base64Payload);
    const userPayload = JSON.parse(payload);
    const userRole = userPayload.role;
    const userName = userPayload.user;
    loginUser({ token: userData.token, rol: userPayload.role });
    const userInfo = {
      token: userData.token,
      rol: userRole,
      user: userName
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUser(userInfo);
    redirigirSegunRol(userInfo);
  };

  //manejo de rutas segun el rol
  const redirigirSegunRol = (user) => {
    if (user.rol === "admin") {
      navigate("/lote", { state: { name_product: user.name_product } });
    } else if (user.rol === "seniat") {
      navigate("/ListadoLote", { state: { name_product: user.name_product } });
    } else {
      navigate("/registroLote", { state: { name_product: user.name_product } })
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <>
      <div className="Container">
        <div className="modal">
          <header className="modal_header">
            <img src="../perfil.jpg" className="imgBox" alt="" />
          </header>

          <main className="modal_content">
            <TextField
              className="custom-text-field"
              fullWidth
              autoFocus
              type="text"
              color="primary"
              margin="normal"
              variant="outlined"
              label="Usuario o Correo"
              placeholder="Usuario o Correo"
              name="userOrEmail" // Se usa un solo nombre para el input
              value={values.userOrEmail}
              style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
            />
            <TextField
              className="custom-text-field"
              fullWidth
              type="password"
              color="primary"
              margin="normal"
              variant="outlined"
              label="Contraseña"
              placeholder="Contraseña"
              name="password"
              value={values.password}
              style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
            />

            <Link
              className="desbloq"
              to={"/desbloqueo"}>
              DESBLOQUEAR
            </Link>
          </main>

          <footer className="modal_footer">
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={handleSubmit}
              className="boton"
            >
              ACEPTAR
            </Button>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;