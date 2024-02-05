import {configureStore,combineReducers} from "@reduxjs/toolkit"
import userReducer from "./user/userSlice.js"
import {persistReducer, persistStore} from "redux-persist"
import themeReducer from "./theme/themeSlice.js"
import storage from "redux-persist/lib/storage"
// import { buildGetDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware.js"
const rootReducer=combineReducers({
    user:userReducer,
    theme:themeReducer
})
const persistConfig={
    key:'root',
    storage,
    version:1,
}
const persistedReducer=persistReducer(persistConfig,rootReducer)
export const store=configureStore({
    reducer:persistedReducer,
})

export const persistor=persistStore(store)