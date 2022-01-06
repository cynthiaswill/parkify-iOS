import axios from "axios";
import { Pressable } from "react-native";
const frostyApi = axios.create({
  baseURL: "https://frosty-api2.herokuapp.com/api",
});

export const getEvents = (token, category) => {
  let path = `/events`;
  if (category !== "All categories") {
    path += `?category=${category}`;
  }
  return frostyApi.get(path, { headers: { "x-auth-token": token } });
};
export const getProfile = (token) => {
  return frostyApi.get("/users/profile/me", {
    headers: { "x-auth-token": token },
  });
};
export const getUsers = (token) => {
  return frostyApi.get("/users", { headers: { "x-auth-token": token } });
};
export const getUser = (token, username) => {
  return frostyApi.get(`/users/${username}`, {
    headers: { "x-auth-token": token },
  });
};
export const getCategories = () => {
  return frostyApi.get("/categories");
};
export const getParks = () => {
  return frostyApi.get("/parks");
};
export const getComments = (token, id) => {
  return frostyApi.get(`/comments/event/${id}`, {
    headers: { "x-auth-token": token },
  });
};
export const postComment = (id) => {
  //
};
export const postNewUser = (newUser) => {
  return frostyApi.post("/users/register", newUser);
};

export const loginUser = (newUser) => {
  return frostyApi.post("/users/login", newUser);
};

export const postEvent = (token, newEvent) => {
  return frostyApi.post("/events", newEvent, {
    headers: { "x-auth-token": token },
  });
};
