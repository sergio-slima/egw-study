import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App'
import Home from './Home';

import './index.css';

import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

const PUBLISHABLE_KEY = 'pk_test_ZW1pbmVudC1nbnUtODYuY2xlcmsuYWNjb3VudHMuZGV2JA' //process.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const root = ReactDOM.createRoot(document.getElementById('root'));

const ClerkWithRoutes = () => {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <Routes>
        <Route path='/' element={<App />} />
        <Route 
          path='/sign-in/*' 
          element={<SignIn redirectUrl={'/home'} routing='path' path='/sign-in' />}
        />
        <Route 
          path='/sign-up/*' 
          element={<SignUp redirectUrl={'/home'} routing='path' path='/sign-up' />} //redirectUrl
        />
        <Route 
          path='/home'
          element={
            <>
              <SignedIn>
                <Home />
              </SignedIn>
              <SignedOut>
                <App />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  )
}

root.render(
  <React.StrictMode>
      <BrowserRouter>
        <ClerkWithRoutes />
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
