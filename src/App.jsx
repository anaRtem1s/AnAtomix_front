// ::::::::::::::::::::: MAIN ROUTER / MAP COMPONENT WHERE ALL SUB COMPONENTS ARE GLUED / IMPORTED - frontend ROUTES ::::::::::::::::::::: 

// CSS STYLE

import './App.css'
import { useState } from "react";
import Layout from './general_layout/Layout'
import LoginForm from './pages/auth/Login'
import RegisterForm from './pages/auth/Register'

export default function App() {

  // 'auth' = page d'accueil avec les 2 formulaires | 'reader' = l'app après login

  const [screen, setScreen] = useState("auth");

  return (
    <Layout onNav={setScreen}>
      {screen === "auth" && (
        <div className="auth-container">
          <RegisterForm onSuccess={() => setScreen("auth")} />
            <span> OR </span>
          <LoginForm onSuccess={() => setScreen("reader")} />
        </div>
      )}
      {screen === "reader" && <p>RSS Reader (to come)</p>}
    </Layout>
  );
}