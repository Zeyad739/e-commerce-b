import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to load user and token from localStorage
const loadAuthData = () => {
  try {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user, isAuthenticated: Boolean(token && user) };
  } catch {
    return { token: null, user: null, isAuthenticated: false };
  }
};

const initialAuth = loadAuthData();

// Login user thunk
export const loginUser = createAsyncThunk(
  "users/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://dummyjson.com/auth/login",
        {
          username: username.trim(),
          password: password.trim(),
          expiresInMins: 120,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      const token = data.accessToken || data.token;

      // Fetch full profile immediately to obtain role and details
      let fullProfile = { ...data };
      try {
        const meResponse = await axios.get("https://dummyjson.com/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        fullProfile = { ...fullProfile, ...meResponse.data };
      } catch (err) {
        console.warn("Could not fetch auth profile immediately", err);
      }

      // Save auth token and full user info
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(fullProfile));
      return fullProfile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Invalid username or password. Please try again."
      );
    }
  }
);

// Fetch authenticated user profile with Bearer token
export const fetchAuthUser = createAsyncThunk(
  "users/fetchAuthUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.users.token || localStorage.getItem("auth_token");
      if (!token) return rejectWithValue("No token found");

      const response = await axios.get("https://dummyjson.com/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("auth_user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch authenticated user"
      );
    }
  }
);

// Register user (mock / API)
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://dummyjson.com/users/add",
        userData
      );
      // DummyJSON returns added user with id 209 (or similar)
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register user"
      );
    }
  }
);

// Fetch all users for Users Module / Dashboard
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async ({ limit = 10, skip = 0, query = "" } = {}, { rejectWithValue }) => {
    try {
      let url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
      if (query && query.trim() !== "") {
        url = `https://dummyjson.com/users/search?q=${encodeURIComponent(
          query.trim()
        )}&limit=${limit}&skip=${skip}`;
      }
      const response = await axios.get(url);
      return {
        users: response.data.users,
        total: response.data.total,
        skip: response.data.skip,
        limit: response.data.limit,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users list"
      );
    }
  }
);

// Delete user (Dashboard CRUD)
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`https://dummyjson.com/users/${id}`);
      return { id, isDeleted: response.data.isDeleted };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: initialAuth.user,
    token: initialAuth.token,
    isAuthenticated: initialAuth.isAuthenticated,
    loading: false,
    authError: null,

    // Users list module state
    usersList: [],
    usersTotal: 0,
    usersSkip: 0,
    usersLimit: 10,
    usersLoading: false,
    usersError: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.authError = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    },
    clearAuthError: (state) => {
      state.authError = null;
    },
    setUsersPage: (state, action) => {
      state.usersSkip = action.payload * state.usersLimit;
    },
    // Direct local user additions/deletions for dashboard
    addUserLocally: (state, action) => {
      state.usersList.unshift(action.payload);
      state.usersTotal += 1;
    },
    deleteUserLocally: (state, action) => {
      state.usersList = state.usersList.filter((u) => u.id !== action.payload);
      state.usersTotal = Math.max(0, state.usersTotal - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.authError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken || action.payload.token;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.authError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.authError = action.payload;
      })
      // fetchAuthUser
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.currentUser = { ...state.currentUser, ...action.payload };
      })
      // fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.usersList = action.payload.users;
        state.usersTotal = action.payload.total;
        state.usersSkip = action.payload.skip;
        state.usersLimit = action.payload.limit;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.usersList = state.usersList.filter((u) => u.id !== action.payload.id);
        state.usersTotal = Math.max(0, state.usersTotal - 1);
      });
  },
});

export const {
  logout,
  clearAuthError,
  setUsersPage,
  addUserLocally,
  deleteUserLocally,
} =
  usersSlice.actions;

export default usersSlice.reducer;
