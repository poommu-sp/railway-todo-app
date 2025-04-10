import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { signIn } from "../authSlice";
import { Header } from "../components/Header";
import { signUpUser } from "../apis/auth";
import "./signUp.scss";

export const SignUp = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessge] = useState();
  const [, setCookie] = useCookies(["token"]);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const onSignUp = async () => {
    try {
      const data = await signUpUser(email, name, password);
      setCookie("token", data.token);
      dispatch(signIn());
      navigate("/");
    } catch (err) {
      setErrorMessge(`サインアップに失敗しました。 ${err}`);
    }
  };

  if (auth) return <Navigate to="/" />;

  return (
    <div>
      <Header />
      <main className="signup">
        <h2>新規作成</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="signup-form">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            onChange={handleEmailChange}
            className="email-input"
          />

          <label htmlFor="name">ユーザ名</label>
          <input
            id="name"
            type="text"
            onChange={handleNameChange}
            className="name-input"
          />

          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            onChange={handlePasswordChange}
            className="password-input"
          />

          <button type="button" onClick={onSignUp} className="signup-button">
            作成
          </button>
        </form>
      </main>
    </div>
  );
};
