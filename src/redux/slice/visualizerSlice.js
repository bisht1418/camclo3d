import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    steps: 0,
    template: []
}

const visualizerSlice = createSlice({
    name: 'visualizer',
    initialState,
    reducers: {
        setSteps: (state, action) => {
            state.steps = action.payload
        },
        setTemplate: (state, action) => {
            state.template = action.payload
        },
        clearSteps: (state, action) => {
            state.steps = 0
            state.template=[]
        },
    }
})

export const { setSteps, clearSteps, setTemplate } = visualizerSlice.actions

export default visualizerSlice.reducer