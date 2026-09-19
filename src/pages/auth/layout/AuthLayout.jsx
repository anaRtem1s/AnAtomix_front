
export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-logo">
        <h1>AnAtomix</h1>
      </div>
      <main className="auth-content">
        {children}
        </main>
    </div>
  );
}