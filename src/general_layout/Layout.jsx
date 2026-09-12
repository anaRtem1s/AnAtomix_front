import Header from "./Header";

export default function Layout({ children, onNav }) {
  return (
    <>
      <Header onNav={onNav} />
      <main>
        {children}   {/* RegisterForm / LoginForm / Reader */}
      </main>
    </>
  );
}