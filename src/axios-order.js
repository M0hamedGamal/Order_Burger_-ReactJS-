import axios from "axios";

// Create instance from axios to work with API.
const instance = axios.create({
  // URL of firebase database.
  baseURL: "https://react-build-burger-511f1.firebaseio.com",
});

export default instance;
