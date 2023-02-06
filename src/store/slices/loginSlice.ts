import axios from '../../axios'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    userDataLoading: false,
    userDataError: false,
};

export const fetchUserData: any = createAsyncThunk("login/fetchUserData", async (params) => {
    const { data } = await axios.post('/auth/login', params)
    return data
});

export const fetchRegister: any = createAsyncThunk("auth/fetchRegister", async (params) => {
    const { data } = await axios.post('/auth/register', params)
    return data
});

export const fetchAuthMe: any = createAsyncThunk("login/fetchAuthMe", async () => {
    const { data } = await axios.get('/auth/me')
    return data
});

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        login_logout: (state) => {
            state.userData = null
        }
    },
    extraReducers: builder => {
        builder 
            .addCase(fetchUserData.pending, state => {
                state.userDataLoading = true;
                state.userDataError = false;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.userDataLoading = false;
                state.userDataError = false;
            })
            .addCase(fetchUserData.rejected, state => {
                state.userDataError = true;
                state.userDataLoading = false;
            })
            .addCase(fetchAuthMe.pending, state => {
                state.userDataLoading = true;
                state.userDataError = false;
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.userDataLoading = false;
                state.userDataError = false;
            })
            .addCase(fetchAuthMe.rejected, state => {
                state.userDataError = true;
                state.userDataLoading = false;
            })
            .addCase(fetchRegister.pending, state => {
                state.userDataLoading = true;
                state.userDataError = false;
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.userDataLoading = false;
                state.userDataError = false;
            })
            .addCase(fetchRegister.rejected, state => {
                state.userDataError = true;
                state.userDataLoading = false;
            })
        }
});

const { actions, reducer } = loginSlice;

export default reducer;

export const { login_logout
} = actions;