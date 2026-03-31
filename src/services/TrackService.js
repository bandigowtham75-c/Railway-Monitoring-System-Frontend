import API from "./api";

export const getTracks = () => {
  return API.get("/tracks");
};

export const addTrack = (track) => {
  return API.post("/tracks", track);
};

export const updateTrack = (id, track) => {
  return API.put(`/tracks/${id}`, track);
};

export const deleteTrack = (id) => {
  return API.delete(`/tracks/${id}`);
};
