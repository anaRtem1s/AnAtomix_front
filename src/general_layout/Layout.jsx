import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children, onNav, account, onLogout }) {
  return (
    <>
      <div className="layout-container">

        <Header account={account} onLogout={onLogout} onNav={onNav} />

        <main>{children}</main>  {/* RegisterForm / LoginForm / Reader */}
        
        <Footer onNav={onNav} />
      </div>
    </>
  );
}

