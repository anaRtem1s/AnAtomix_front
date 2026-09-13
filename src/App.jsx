import './App.css'

import { useState, useEffect } from "react";
import Layout from './general_layout/Layout'
import LoginForm from './pages/auth/Login'
import RegisterForm from './pages/auth/Register'

export default function App() {

  // 'auth' = page d'accueil avec les 2 formulaires | 'reader' = l'app après login

  const [screen, setScreen] = useState("auth");

  // Track the logged-in account here 

  const [account, setAccount] = useState(null);


  useEffect(() => {
    const savedAccount = localStorage.getItem("account");

    // Only try to parse if something exists
    if (savedAccount && savedAccount !== "null" && savedAccount !== "undefined") {
      try {
        const parsedAccount = JSON.parse(savedAccount);

        // Verify it's actually an object before setting state
        if (parsedAccount && typeof parsedAccount === 'object') {
          setAccount(parsedAccount);
          setScreen("reader");

        } else {

          localStorage.removeItem("account");
        }
      } catch (error) {

        localStorage.clear();

      }
    }
  }, []);



  const handleLoginSuccess = (accountData, token) => {


    localStorage.setItem("token", token);

    localStorage.setItem("account", JSON.stringify(accountData));

    setAccount(accountData);

    setScreen("reader"); // IMMEDIATE REDIRECT TO MAIN APP

  };

  const handleLogout = () => {

    //  Clear storage

    localStorage.removeItem("token");
    localStorage.removeItem("account");

    // Clear State

    setAccount(null);

    // Switch Screen

    setScreen("auth");
  };

  return (
    <Layout onNav={setScreen}
      account={account}        // PASS ACCOUNT TO LAYOUT 
      onLogout={handleLogout} // PASS LOGOUT FUNCTION TO LAYOUT
    >
      {screen === "auth" && (
        <div className="auth-container">
          <RegisterForm onSuccess={() => setScreen("auth")} />
          <span> OR </span>
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      )}
      {screen === "reader" 
      && <h2> Welcome {account.username}! <span>- RSS Reader (to come!)</span> </h2>
      }
      
      

    </Layout>
  );
}