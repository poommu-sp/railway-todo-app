import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import "./editList.scss";
import { updateList, deleteList, getList } from "../apis/list";

export const EditList = () => {
  const navigate = useNavigate();
  const { listId } = useParams();
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies(["token"]);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const onUpdateList = () => {
    const data = { title };

    updateList(cookies.token, listId, data)
      .then(() => navigate("/"))
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  const onDeleteList = () => {
    deleteList(cookies.token, listId)
      .then(() => navigate("/"))
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    getList(cookies.token, listId)
      .then((res) => {
        const list = res.data;
        setTitle(list.title);
      })
      .catch((err) => {
        setErrorMessage(`リスト情報の取得に失敗しました。${err}`);
      });
  }, [listId]);

  return (
    <div>
      <Header />
      <main className="edit-list">
        <h2>リスト編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-list-form">
          <div className="form-group">
            <label htmlFor="edit-title" className="form-label">
              タイトル
            </label>
            <input
              id="edit-title"
              type="text"
              className="edit-list-title"
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          <div className="edit-buttons">
            <button
              type="button"
              className="delete-list-button"
              onClick={onDeleteList}
            >
              削除
            </button>
            <button
              type="button"
              className="edit-list-button"
              onClick={onUpdateList}
            >
              更新
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
