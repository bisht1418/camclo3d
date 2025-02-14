import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {},
    token: "",
    myProfile: {},
    notification: [],
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setrefreshToken: (state, action) => {
            state.token = action.payload
        },
        setMyProfile: (state, action) => {
            state.myProfile = action.payload
        },
        setNotification: (state, action) => {
            state.notification = action.payload
        },
        clearAuth: (state, action) => {
            state.user = {}
            state.token = ""
            state.myProfile = {}
            state.notification = []
        },
    }
})

export const { setUser, clearAuth, setrefreshToken, setMyProfile, setNotification } = authSlice.actions

export default authSlice.reducer