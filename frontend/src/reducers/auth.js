import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

const initialState = {
  access: null,
  refresh: null,
  isAuthenticated: false,
  loading: true,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginsuccess: (state, action) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.isAuthenticated = true;
    },
    autherror : (state) => {
      state.token = null;
      state.isAuthenticated = false;
      
    },
    loginfail: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      
    },
    userloaded: (state,action)=>{
      state.isAuthenticated = true;
      state.user = action.payload ;
    }
  }
});

export const { loginsuccess,loginfail,userloaded,autherror } = authSlice.actions;

export default authSlice.reducer;


export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {

    const res = await axios.get('http://127.0.0.1:8000/api/token');
    console.log(res)
    dispatch(userloaded(res.data));

  } catch (err) {
    dispatch(autherror());
  }
};

export const login = (email, password) => async dispatch => {
  
  const config = {
    headers: { "Content-Type": "application/json" }
  };

  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/token",body, config);
    dispatch(loginsuccess({access:res.data.access,refresh:res.data.refresh}));
    dispatch(loadUser());
  } catch (err) {
    dispatch(loginfail());
  }
};