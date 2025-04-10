import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";
import "./newList.scss";
import { createList } from "../apis/list";

export const NewList = () => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleTitleChange = (e) => setTitle(e.target.value);
  const onCreateList = () => {
    const data = { title };

    createList(cookies.token, data)
      .then(() => navigate("/"))
      .catch((err) => {
        setErrorMessage(`リストの作成に失敗しました。${err}`);
      });
  };

  return (
    <div>
      <Header />
      <main className="new-list">
        <h2>リスト新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-list-form">
          <div className="form-group">
            <label htmlFor="title-input" className="form-label">
              タイトル
            </label>
            <input
              id="title-input"
              type="text"
              onChange={handleTitleChange}
              className="new-list-title"
            />
          </div>
          <button
            type="button"
            onClick={onCreateList}
            className="new-list-button"
          >
            作成
          </button>
        </form>
      </main>
    </div>
  );
};
