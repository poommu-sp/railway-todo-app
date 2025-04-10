import axios from "axios";
import { url } from "../const";

export const signUpUser = async (email, name, password) => {
  const data = { email, name, password };
  const response = await axios.post(`${url}/users`, data);
  return response.data;
};

export const signInUser = async (email, password) => {
  const response = await axios.post(`${url}/signin`, { email, password });
  return response.data;
};
