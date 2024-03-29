import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart:(state)=>{
      state.loading=true;
      state.error=null
    },
    deleteUserSuccess:(state)=>{
      state.loading=false;
      state.currentUser=null;
      state.error=null
    },
    deleteUserFailure:(state,action)=>{
      state.loading=false;
      state.error=action.payload
    },
    signoutUserStart:(state)=>{
      state.loading=true
      state.error=null
    },
    signoutUserSuccess:(state)=>{
      state.loading=false;
      state.currentUser=null;
      state.error=null
    },
    signoutUserFailure:(state,action)=>{
      state.loading=false;
      state.error=action.payload
    }
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess
} = userSlice.actions;
export default userSlice.reducer;
