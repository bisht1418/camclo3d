import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    dashboard: [],
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setDashboard: (state, action) => {
            state.dashboard = action.payload
        },
        clearDashboard: (state, action) => {
            state.dashboard = {}
        },
    }
})

export const { setDashboard, clearDashboard } = dashboardSlice.actions

export default dashboardSlice.reducer