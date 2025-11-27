import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import './index.css'
import App from './App'
import store from './store'
 import { ToastProvider } from './components/Toast';

createRoot(document.getElementById('root')).render(
    <ToastProvider position="top-right" richColors>
        <Provider store={store}>
             <App />
        </Provider>
    </ToastProvider>

)
