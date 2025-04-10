import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import "./editTask.scss";
import { updateTask, deleteTask, fetchTask } from "../apis/task";

export const EditTask = () => {
  const navigate = useNavigate();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies(["token"]);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isDone, setIsDone] = useState();
  const [limit, setLimit] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === "done");
  const handleLimitChange = (e) => setLimit(e.target.value);
  const onUpdateTask = () => {
    const data = {
      title: title,
      detail: detail,
      done: isDone,
      limit: new Date(limit).toISOString(),
    };

    updateTask(cookies.token, listId, taskId, data)
      .then(() => navigate("/"))
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  const onDeleteTask = () => {
    deleteTask(cookies.token, listId, taskId)
      .then(() => navigate("/"))
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    fetchTask(cookies.token, listId, taskId)
      .then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDetail(task.detail);
        setIsDone(task.done);
        setLimit(formatDatetimeLocal(task.limit));
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`);
      });
  }, [listId, taskId]);

  const formatDatetimeLocal = (isoString) => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  };

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <div className="form-group">
            <label htmlFor="task-title">タイトル</label>
            <input
              type="text"
              id="task-title"
              onChange={handleTitleChange}
              className="edit-task-title"
              value={title}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-detail">詳細</label>
            <textarea
              id="task-detail"
              onChange={handleDetailChange}
              className="edit-task-detail"
              value={detail}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-limit">期限</label>
            <input
              type="datetime-local"
              id="task-limit"
              onChange={handleLimitChange}
              className="edit-task-limit"
              value={limit}
            />
          </div>

          <div className="form-group">
            <label>状態</label>
            <div>
              <input
                type="radio"
                id="todo"
                name="status"
                value="todo"
                onChange={handleIsDoneChange}
                checked={isDone === false}
              />
              <label htmlFor="todo">未完了</label>
              <input
                type="radio"
                id="done"
                name="status"
                value="done"
                onChange={handleIsDoneChange}
                checked={isDone === true}
              />
              <label htmlFor="done">完了</label>
            </div>
          </div>

          <div className="edit-buttons">
            <button
              type="button"
              className="delete-task-button"
              onClick={onDeleteTask}
            >
              削除
            </button>

            <button
              type="button"
              className="edit-task-button"
              onClick={onUpdateTask}
            >
              更新
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
