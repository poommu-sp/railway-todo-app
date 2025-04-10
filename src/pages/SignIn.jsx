import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header";
import "./signin.scss";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../authSlice";
import { signInUser } from "../apis/auth";

export const SignIn = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [, setCookie] = useCookies(["token"]);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const onSignIn = async () => {
    try {
      const data = await signInUser(email, password);
      setCookie("token", data.token);
      dispatch(signIn());
      navigate("/");
    } catch (err) {
      setErrorMessage(`サインインに失敗しました。${err}`);
    }
  };

  if (auth) return <Navigate to="/" />;

  return (
    <div>
      <Header />
      <main className="signin">
        <h2>サインイン</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form className="signin-form">
          <label htmlFor="email" className="email-label">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            className="email-input"
            onChange={handleEmailChange}
          />

          <label htmlFor="password" className="password-label">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            className="password-input"
            onChange={handlePasswordChange}
          />

          <button type="button" className="signin-button" onClick={onSignIn}>
            サインイン
          </button>
        </form>

        <Link to="/signup">新規作成</Link>
      </main>
    </div>
  );
};
