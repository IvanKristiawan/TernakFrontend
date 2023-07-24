import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStateContext, tempUrl } from "../../contexts/ContextProvider";
import { AuthContext } from "../../contexts/AuthContext";
import { Container, Card, Button, Form } from "react-bootstrap";
import { Snackbar, Alert } from "@mui/material";

function Login() {
  const { screenSize } = useStateContext();
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { error, dispatch } = useContext(AuthContext);

  const cardContainer = {
    width: screenSize >= 650 ? "23rem" : "18rem"
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      dispatch({ type: "LOGIN_START" });
      try {
        const res = await axios.post(`${tempUrl}/auth/login`, {
          username,
          password
        });
        const findSetting = await axios.post(`${tempUrl}/lastSetting`, {
          _id: res.data.details.id,
          token: res.data.details.token,
          kodeCabang: res.data.details.cabangId
        });
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: res.data.details,
          setting: findSetting.data
        });

        navigate("/admin");
      } catch (err) {
        setOpen(true);
        dispatch({ type: "LOGIN_FAILURE", payload: err });
      }
    }
    setValidated(true);
  };

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <Card style={cardContainer}>
        <Card.Header style={headerContainer}>
          <p style={headerText}>KKN UAJY 83</p>
          <p style={headerText}>(SISTEM INFORMASI TERNAK ONLINE)</p>
          <p style={headerDetail}>Aplikasi Management Ternak</p>
        </Card.Header>
        <Card.Body>
          <Card>
            <Card.Header style={headerDetail}>Login Pengguna</Card.Header>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                className="d-flex flex-column"
                onSubmit={handleClick}
              >
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Control
                    required
                    placeholder="Username"
                    className="mb-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  />
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.toUpperCase())}
                  />
                </Form.Group>
                <Button type="submit">Login</Button>
              </Form>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Username atau Password salah!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}

export default Login;

const headerContainer = {
  fontWeight: 700,
  textAlign: "center"
};

const headerText = {
  marginBottom: 1
};

const headerDetail = {
  fontSize: 12,
  fontWeight: 500,
  color: "gray"
};

const alertBox = {
  width: "100%"
};
