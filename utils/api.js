import axios from "axios";
const frostyApi = axios.create({
  baseURL: "https://frosty-api2.herokuapp.com/api",
});

export const getEvents = () => {
  return frostyApi.get("/events");
};
export const getUsers = () => {
  return frostyApi.get("/users");
};
export const getUser = (id) => {
  return frostyApi.get(`/users/${id}`);
};
export const getCategories = () => {
  return frostyApi.get("/categories");
};
export const getParks = () => {
  return frostyApi.get("/parks");
};
export const getComments = (id) => {
  return frostyApi.get(`/events/${id}/comments`);
};
export const postComment = (id) => {
  //
};
