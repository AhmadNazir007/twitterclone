import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    username: string;
    role: string; // or whatever roles you use
  }
  
  interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: User | null;
  }
  
  const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    user: null,
  };
  
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      },
      logout(state) {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      },
    },
  });
  

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
