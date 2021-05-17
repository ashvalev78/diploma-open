import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import {
  Button,
  Input,
  ButtonGroup,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { connect } from "react-redux";
import { signIn } from "../../store/actions";

import * as colors from "../../common/constants/colors";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  background-color: ${colors.background};
`;

const FormContainer = styled.div`
  display: flex;
  flex-flow: column;
  width: 350px;
  padding: 10px;
`;

const Name = styled.span`
  font-size: 24px;
  margin-bottom: 10px;
`;

const mapStateToProps = (state) => ({
  store: state,
});

export default connect(mapStateToProps)(({ store, dispatch }) => {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [validation, setValidation] = React.useState({
    login: false,
    password: false,
  });
  let history = useHistory();

  React.useEffect(() => {
    if (store.accessToken) {
      history.push("/profile");
    }
  }, []);

  const validate = () => {
    if (login.length < 5) {
      setValidation((prevState) => ({
        ...prevState,
        login: true,
      }));
    } else {
      setValidation((prevState) => ({
        ...prevState,
        login: false,
      }));
    }
    if (password.length < 5) {
      setValidation((prevState) => ({
        ...prevState,
        password: true,
      }));
    } else {
      setValidation((prevState) => ({
        ...prevState,
        password: false,
      }));
    }
  };

  const authorize = () => {
    validate();
    if (login.length > 5 && password.length > 5) {
      setTimeout(() => history.push("/profile"), 300);
      // const body = JSON.stringify({
      //   username: login,
      //   password,
      // });
      // fetch("http://localhost:8080/api/auth/signin", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json;charset=utf-8",
      //   },
      //   body,
      // }).then(async (response) => {
      //   let data = await response.json()
      //   if (data.accessToken) {
      //     dispatch(signIn("SIGN_IN", data.accessToken, data.username));
      //     history.push("/profile");
      //   } else {
      //     dispatch(signIn("SIGN_IN", ""));
      //   }
      // });
    }
  };

  const signUp = () => {
    validate();
    if (login.length > 5 && password.length > 5) {
      const body = JSON.stringify({
        username: login,
        password,
      });
      fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body,
      }).then(async (response) => {
        let data = await response.json()
        console.log(data);
      });
    }
  }

  return (
    <Container>
      <FormContainer>
        <Name>Редактор</Name>
        <FormControl error={validation.login}>
          <Input
            placeholder="Login"
            style={{ marginBottom: "15px" }}
            value={login}
            onChange={(e) => setLogin(e.currentTarget.value)}
            required
          />
          <FormHelperText
            style={{ display: validation.login ? "flex" : "none" }}
          >
            Логин должен содержать минимум 6 символов
          </FormHelperText>
        </FormControl>
        <FormControl error={validation.password}>
          <Input
            placeholder="Password"
            type="password"
            style={{ marginBottom: "15px" }}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <FormHelperText
            style={{ display: validation.password ? "flex" : "none" }}
          >
            Пароль должен содержать минимум от 6 символов
          </FormHelperText>
        </FormControl>
        <ButtonGroup
          color="primary"
          aria-label="outlined primary button group"
          variant="contained"
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: colors.main,
              color: "white",
              width: "120px",
            }}
            onClick={authorize}
          >
            Войти
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: colors.main, flex: 1 }}
            onClick={signUp}
          >
            Зарегистрироваться
          </Button>
        </ButtonGroup>
      </FormContainer>
    </Container>
  );
});
