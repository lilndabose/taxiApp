import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./slices/navSlice";
import authReducer from "./slices/authSlice";


export const store = configureStore({
    reducer: {
        nav: navReducer,
        auth: authReducer,
    },
});