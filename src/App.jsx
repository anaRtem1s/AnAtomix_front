import './App.css'

import { useState, useEffect } from "react";

import AuthLayout from './pages/auth/layout/AuthLayout.jsx';
import MainLayout from './pages/main-app/layout/MainLayout.jsx';

import CenterPage from './pages/main-app/components/CenterPage.jsx';

import AccountSettings from './pages/main-app/components/AccountSettings.jsx';
import CoolLinks from './pages/main-app/components/CoolLinks.jsx';

import Categories from './pages/main-app/components/Categories.jsx';
import FeedSources from './pages/main-app/components/FeedSources.jsx';
import Subscriptions from './pages/main-app/components/Subscriptions.jsx';




export default function App() {

  // -----------------------------------------
  // AUTHENTICATION
  // -----------------------------------------

  const [account, setAccount] = useState(null);

  // -----------------------------------------
  // NAVIGATION
  // -----------------------------------------

  const [screen, setScreen] = useState('login');

  // -----------------------------------------
  // RESTORE SESSION
  // -----------------------------------------

  useEffect(() => {

    const token = localStorage.getItem('token');
    const savedAccount = localStorage.getItem('account');

    if (!token || !savedAccount) {
      return;
    }

    try {

      const parsedAccount = JSON.parse(savedAccount);

      if (parsedAccount && typeof parsedAccount === 'object') {

        setAccount(parsedAccount);
        setScreen('reader');

      }

    } catch (error) {

      console.error('Could not restore session:', error);

      localStorage.removeItem('token');
      localStorage.removeItem('account');

    }

  }, []);


  //? :::::::::::::::::::::::::::::::::::::::: REGISTER ::::::::::::::::::::::::::::::::::::::::

  const handleRegisterSuccess = () => {
    setScreen('login');
  };

  // :::::::::::::::::::::::::::::::::::::::: LOGIN ::::::::::::::::::::::::::::::::::::::::

  const handleLoginSuccess = (accountData, token) => {


    localStorage.setItem("token", token);

    localStorage.setItem("account", JSON.stringify(accountData));

    setAccount(accountData);

    setScreen("reader"); // IMMEDIATE REDIRECT TO MAIN APP

  };

  // :::::::::::::::::::::::::::::::::::::::: LOGOUT ::::::::::::::::::::::::::::::::::::::::

  const handleLogout = () => {

    //  Clear storage

    localStorage.removeItem("token");
    localStorage.removeItem("account");

    // Clear state

    setAccount(null);

    // Switch screen to Auth (Register || Login)

    setScreen("auth");
  };

  // :::::::::::::::::::::::::::::::::::::::: NAVIGATION BETWEEN SCREENS ::::::::::::::::::::::::::::::::::::::::

  const handleNav = (nextScreen) => {
    setScreen(nextScreen);
  };


    // :::::::::::::::::::::::::::::::::::::::: NOT AUTHENTICATED (NOT LOGGED IN) => REGISTER && || => LOGIN ::::::::::::::::::::::::::::::::::::::::
  
    return !account ? (

    <AuthLayout 
      screen={screen}
      handleNav={handleNav}
      handleRegisterSuccess={handleRegisterSuccess}
      handleLoginSuccess={handleLoginSuccess}
    />

  ) : (

    // :::::::::::::::::::::::::::::::::::::::: AUTHENTICATED (LOGGED IN) => MAIN APP ::::::::::::::::::::::::::::::::::::::::

    <MainLayout account={account} onLogout={handleLogout} onNav={handleNav} >

      {screen === 'reader' && (
        <CenterPage account={account} onNav={handleNav} />
      )}

      {screen === 'account-settings' && (
        <AccountSettings account={account} onNav={handleNav} />
      )}

      {screen === 'cool-links' && (
        <CoolLinks onNav={handleNav} />
      )}

      {screen === 'categories-management' && (
        <Categories onNav={handleNav} />
      )}

      {screen === 'feed-sources' && (
        <FeedSources onNav={handleNav} />
      )}

      {screen === 'subscriptions' && (
        <Subscriptions onNav={handleNav} />
      )}

    </MainLayout>
  );
}