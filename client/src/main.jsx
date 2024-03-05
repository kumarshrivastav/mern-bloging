import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store,persistor } from './redux/store.js'
import {Provider} from "react-redux"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PersistGate} from 'redux-persist/integration/react'
import ThemeProvider from './components/ThemeProvider.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer/>
    <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
      <App />
      </ThemeProvider>
    
    </Provider>
    </PersistGate>
  </React.StrictMode>,
)
