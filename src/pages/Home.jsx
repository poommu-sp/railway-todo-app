import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Header } from "../components/Header";
import { url } from "../const";
import "./home.scss";
import { fetchLists, fetchTasksForList } from "../apis/list";

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState("todo"); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies(["token"]);
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);
  useEffect(() => {
    fetchLists(cookies.token)
      .then((res) => {
        setLists(res.data);
        if (res.data.length > 0) {
          setSelectListId(res.data[0].id);
        }
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== "undefined") {
      setSelectListId(listId);
      fetchTasksForList(cookies.token, selectListId)
        .then((res) => {
          setTasks(res.data.tasks);
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`);
        });
    }
  }, [lists]);

  const handleSelectList = (id) => {
    setSelectListId(id);
    fetchTasksForList(cookies.token, id)
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`);
      });
  };

  const handleTabKeyDown = (e) => {
    // Get the current active tab index
    const currentActiveIndex = lists.findIndex(
      (list) => list.id === selectListId,
    );
    if (e.key === "ArrowLeft") {
      // Move focus to the previous tab, wrapping to the last item if on the first
      const previousIndex =
        currentActiveIndex === 0 ? lists.length - 1 : currentActiveIndex - 1;
      handleSelectList(lists[previousIndex].id);
    } else if (e.key === "ArrowRight") {
      // Move focus to the next tab, wrapping to the first item if on the last
      const nextIndex =
        currentActiveIndex === lists.length - 1 ? 0 : currentActiveIndex + 1;
      handleSelectList(lists[nextIndex].id);
    }
  };

  useEffect(() => {
    const activeTab = document.querySelector(".list-tab-item.active");
    if (activeTab) {
      activeTab.focus();
    }
  }, [selectListId]);

  return (
    <div>
      <Header />
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to="/list/new" className="link-text">
                  リスト新規作成
                </Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`} className="link-text">
                  選択中のリストを編集
                </Link>
              </p>
            </div>
          </div>
          <ul className="list-tab">
            {lists.map((list, key) => {
              const isActive = list.id === selectListId;
              return (
                <li
                  key={key}
                  className={`list-tab-item ${isActive ? "active" : ""}`}
                  onClick={() => handleSelectList(list.id)}
                  onKeyDown={(e) => handleTabKeyDown(e)}
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isActive}
                  aria-controls={`tab-content-${list.id}`}
                >
                  <h3>{list.title}</h3>
                </li>
              );
            })}
          </ul>
          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to="/task/new" className="link-text">
                タスク新規作成
              </Link>
            </div>
            <div className="display-select-wrapper">
              <select
                onChange={handleIsDoneDisplayChange}
                className="display-select"
              >
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks
              tasks={tasks}
              selectListId={selectListId}
              isDoneDisplay={isDoneDisplay}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// 表示するタスク
const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay } = props;
  const calculateRemainingTime = (limit) => {
    const now = new Date();
    const due = new Date(limit);
    const diff = due - now;
    // expired
    if (diff <= 0) return "期限切れ";
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let remainingTime = "";
    if (days > 0) {
      remainingTime += `${days}日 `;
    }
    if (hours > 0 || days > 0) {
      remainingTime += `${hours}時間 `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      remainingTime += `${minutes}分 残り`;
    }
    return remainingTime;
  };

  const formatDeadline = (limit) => {
    const deadline = new Date(limit);
    return deadline.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (tasks === null) return <></>;

  if (isDoneDisplay === "done") {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => (
            <li key={key} className="task-item">
              <Link
                to={`/lists/${selectListId}/tasks/${task.id}`}
                className="task-item-link"
              >
                <h3>{task.title}</h3>
                <strong>期限:</strong> {formatDeadline(task.limit)}
                <br />
                <strong>Status:</strong> {task.done ? "完了" : "未完了"}
              </Link>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <ul>
      {tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task, key) => (
          <li key={key} className="task-item">
            <Link
              to={`/lists/${selectListId}/tasks/${task.id}`}
              className="task-item-link"
            >
              <h3>{task.title}</h3>
              <strong>期限:</strong> {formatDeadline(task.limit)}
              <br />
              <strong>残り時間:</strong> {calculateRemainingTime(task.limit)}
              <br />
              <strong>Status:</strong> {task.done ? "完了" : "未完了"}
            </Link>
          </li>
        ))}
    </ul>
  );
};
