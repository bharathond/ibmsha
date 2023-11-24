import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../config/config";

const loginUrl = SERVER_URL + "api/auth/";
const apiUrl = SERVER_URL;

const verifyUser = async (token) => {
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": token,
  };
  let verify = await axios
    .post(
      loginUrl + "verifyUser",
      {},
      {
        headers: headers,
      }
    )
    .then((res) => res?.data)
    .catch((err) => console.log(err));
  return verify;
};

export const adminLogin = createAsyncThunk(
  "user/adminlogin",
  async (loginData) => {
    let user = await axios
      .post(loginUrl + "requestToken", loginData)
      .then(async (res) => {
        let data = res.data;
        if (data?.error !== "yes") {
          let verifiedUser = await verifyUser(data.token);
          if (verifiedUser.error === "no") {
            return data;
          }
        } else {
          return data;
        }
      })
      .catch((err) => console.log(err));
    return user;
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData) => {
    let createUser = await axios
      .post(apiUrl + "user/createUser", userData)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    return createUser;
  }
);

const initialValue = {
  user: [],
  token: "",
  isAuth: false,
  isAdmin: false,
  isUser: false,
};

const UserSlice = createSlice({
  name: "user",
  reducers: {},
  initialState: initialValue,
  extraReducers: (builder) => {
    builder.addCase(adminLogin.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.token = action.payload.token;
      state.user = action.payload.data;
      state.isAuth = true;
      state.isUser = action.payload.data.role === "user" ? true : false;
      state.isAdmin = action.payload.data.role === "admin" ? true : false;
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          token: state.token,
          isAuth: state.isAuth,
          isAdmin: state.isAdmin,
          isUser: state.isUser,
        })
      );
    });
    builder.addCase(adminLogin.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(adminLogin.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export default UserSlice.reducer;
