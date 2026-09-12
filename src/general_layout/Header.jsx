export default function Header({ onNav }) { //! TO RECONSIDER

    const go = (e, screenId) => {
        e.preventDefault();          // empêche le saut de hash inutile
        if (onNav) onNav(screenId);  // prévient App.jsx : "affiche cet écran"
    };

    return (
        <header className="header">
            <h1>RSS | Atom Aggregator</h1>
            <nav>
                <ul className="header-nav">
                    {/* <li><a href="#login" onClick={(e) => go(e, "login")}>Login</a></li>
                    <li><a href="#reader" onClick={(e) => go(e, "reader")}>Feeds</a></li> */}
                </ul>
            </nav>
        </header>
    );
}