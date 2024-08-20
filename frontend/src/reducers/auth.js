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
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;
      
    },
    userloaded: (state,action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      
    },
  }
});

export const { loginsuccess,loginfail,userloaded,autherror } = authSlice.actions;

export default authSlice.reducer;

export const loadUser = () => async (dispatch) => {
  const access = localStorage.getItem('access');
  
  if (access) {
    setAuthToken(access);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/user');
      dispatch(userloaded(res.data.user.email));
    } catch (err) {
      try {
        const config = {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        };
        const body = JSON.stringify({ refresh: localStorage.getItem('refresh') });
        const res = await axios.post('http://127.0.0.1:8000/api/token/refresh', body, config);
        localStorage.setItem('access', res.data.access);
        setAuthToken(res.data.access);
        const userRes = await axios.get('http://127.0.0.1:8000/api/user');
        dispatch(userloaded(userRes.data.user.email));
      } catch (err) {
        dispatch(autherror());
      }
    }
  } 
  else{
    dispatch(autherror());
  }
};

export const login = (email, password) => async dispatch => {
  
  const config = {
    headers: { "Content-Type": "application/json" },
    withCredentials : true
  };

  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/token",body, config);
    localStorage.setItem('access',res.data.access)
    localStorage.setItem('refresh',res.data.refresh)
    localStorage.setItem('token-expiry',res.data.token_expiry)
    dispatch(loginsuccess({access:res.data.access,refresh:res.data.refresh}));
    dispatch(loadUser())
  } catch (err) {
    dispatch(loginfail());
  }
};