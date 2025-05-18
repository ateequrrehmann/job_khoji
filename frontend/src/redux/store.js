import { configureStore } from "@reduxjs/toolkit";
import authSlice from '../redux/authSlice.js'

const Store = configureStore({
    reducer: {
        auth: authSlice
    }
});

export default Store;