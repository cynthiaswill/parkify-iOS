import axios from "axios";
const frostyApi = axios.create({
  baseURL: "https://frosty-api2.herokuapp.com/api",
});

export const getUserByUsername = (username) => {
  return frostyApi.get(`/users/${username}`);
};

export const deleteEvent = (id) => {
  return frostyApi.delete(`/events/${id}/`);
};

export const getHistory = (title) => {
  return frostyApi.get(`/chat/${title}`);
};

export const joinEvent = (token, event_id) => {
  console.log(token);
  return frostyApi.post(
    `events/${event_id}/perticipate`,
    {},
    {
      headers: { "x-auth-token": token },
    }
  );
};

export const leaveEvent = (token, event_id) => {
  return frostyApi.delete(
    `events/${event_id}/perticipate`,

    {
      headers: { "x-auth-token": token },
    }
  );
};
