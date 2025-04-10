import axios from "axios";
import { url } from "../const";

export const fetchLists = (token) => {
  return axios.get(`${url}/lists`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const createList = (token, data) => {
  return axios.post(`${url}/lists`, data, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const deleteList = (token, listId) => {
  return axios.delete(`${url}/lists/${listId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const getList = (token, listId) => {
  return axios.get(`${url}/lists/${listId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const updateList = (token, listId, data) => {
  return axios.put(`${url}/lists/${listId}`, data, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const fetchTasksForList = (token, listId) => {
  return axios.get(`${url}/lists/${listId}/tasks`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};
