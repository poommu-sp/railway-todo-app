import axios from "axios";
import { url } from "../const";

export const createTask = (token, listId, taskData) => {
  return axios.post(`${url}/lists/${listId}/tasks`, taskData, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const updateTask = (token, listId, taskId, data) => {
  return axios.put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTask = (token, listId, taskId) => {
  return axios.delete(`${url}/lists/${listId}/tasks/${taskId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const fetchTask = (token, listId, taskId) => {
  return axios.get(`${url}/lists/${listId}/tasks/${taskId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};
