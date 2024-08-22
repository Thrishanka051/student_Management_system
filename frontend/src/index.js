
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter> {/* Wrap App with BrowserRouter */}
    <React.StrictMode> {/* You can remove StrictMode */}
      <App />
      <ToastContainer /> {/* Render ToastContainer */}
    </React.StrictMode>
  </BrowserRouter>
);


