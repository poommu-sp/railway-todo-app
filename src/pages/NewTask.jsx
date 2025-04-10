import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { createTask } from "../apis/task";
import { fetchLists } from "../apis/list";
import { Header } from "../components/Header";
import "./newTask.scss";
import { useNavigate } from "react-router-dom";

export const NewTask = () => {
  const [selectListId, setSelectListId] = useState();
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [limit, setLimit] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleSelectList = (id) => setSelectListId(id);
  const handleLimitChange = (e) => setLimit(e.target.value);
  const onCreateTask = () => {
    const taskData = {
      title,
      detail,
      done: false,
      limit: new Date(limit).toISOString(),
    };

    createTask(cookies.token, selectListId, taskData)
      .then(() => navigate("/"))
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    fetchLists(cookies.token)
      .then((res) => {
        setLists(res.data);
        setSelectListId(res.data[0]?.id);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <div className="form-group">
            <label htmlFor="task-select-list">リスト</label>
            <select
              id="task-select-list"
              onChange={(e) => handleSelectList(e.target.value)}
              className="new-task-select-list"
            >
              {lists.map((list, key) => (
                <option key={key} className="list-item" value={list.id}>
                  {list.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-title">タイトル</label>
            <input
              type="text"
              id="task-title"
              onChange={handleTitleChange}
              className="new-task-title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-detail">詳細</label>
            <textarea
              type="text"
              id="tesk-detail"
              onChange={handleDetailChange}
              className="new-task-detail"
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-limit">期限</label>
            <input
              type="datetime-local"
              id="task-limit"
              onChange={handleLimitChange}
              className="new-task-limit"
            />
          </div>

          <div className="edit-buttons">
            <button
              type="button"
              className="new-task-button"
              onClick={onCreateTask}
            >
              作成
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
