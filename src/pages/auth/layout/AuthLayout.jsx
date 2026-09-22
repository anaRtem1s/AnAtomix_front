
import LoginForm from '../components/Login.jsx';
import RegisterForm from '../components/Register.jsx';

export default function AuthLayout({ screen, handleNav, handleRegisterSuccess, handleLoginSuccess }) {
  return (
    <div className="auth-layout">
      <h1 id="auth-welcome-title">AnAtomix</h1>
      <div className="auth-container">

        {/* CONDITIONALLY RENDERS */}

        {screen === 'register' ? (
          <>
            <RegisterForm onSuccess={handleRegisterSuccess} />

            <button type="button" onClick={() => handleNav('login')}>
              🔑 Login?
            </button>

          </>

        ) : (

          <>
            <LoginForm onSuccess={handleLoginSuccess} />

            <button type="button" onClick={() => handleNav('register')}>
              🔏 Create an account?
            </button>

          </>
        )}

      </div>
    </div>
  );
}