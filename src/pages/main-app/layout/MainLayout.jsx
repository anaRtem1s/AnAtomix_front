import Footer from "./Footer"
import Header from "./Header"
import LeftBar from "./LeftBar"

export default function MainLayout({ children, account, onLogout, onNav }) {

  return (
    <>
      <div className="main-layout">

        <Header account={account} onLogout={onLogout} onNav={onNav} />

        <div className="middle-container">

          <LeftBar onNav={onNav} />

          <main>{children}</main>  {/*  CenterPage w/ Feeds List || Account Settings */}

        </div>


        <Footer />

      </div>
    </>
  );
}

