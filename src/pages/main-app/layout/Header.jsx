export default function Header({ account, onLogout, onNav }) {

  // --- DEV  ---

  console.log("Account:", account);

  //! EXPLAIN

  const go = (e, screenId) => {
    e.preventDefault();
    if (onNav) onNav(screenId);
  };

  return (
    <header className="header">
      <h1 onClick={() => onNav('reader')} role="button" className="app-name"
        tabIndex="0"
        onKeyDown={(eventElement) => {
          if (eventElement.key === 'Enter' || eventElement.key === ' ') {
            onNav('reader');
          }
        }}
        aria-label="Go back to articles stream">
        AnAtomix: RSS | Atom Feeds Aggregator
      </h1>
      <nav>
        <ul className="header-nav">

          {/* If account is logged, show buttons */}

          {account ? (
            <>
              {/* ACCOUNT SETTINGS BUTTON */}

              <li>
                <button onClick={() => onNav('account-settings')} className="btn-account-settings">
                  ⚙️ Account settings
                </button>
              </li>

              {/* CATEGORIES MANAGEMENT BUTTON */}
              <li>
                <button onClick={() => onNav('categories-management')} className="btn-categories-management">
                  🍄 Manage Categories
                </button>
              </li>

              {/* TAGS MANAGEMENT BUTTON */}
              <li>
                <button onClick={() => onNav('tags-management')} className="btn-tags-management">
                  🍬 Manage Tags
                </button>
              </li>


              {/* LINX BUTTON */}

              <li>
                <button onClick={() => onNav('cool-links')} role="contentinfo" className="btn-cool-links">
                  🥝 Cool linX
                </button>
              </li>

              {/* LOGOUT BUTTON + REDIRECTION TO AUTH SCREEN*/}

              <li>
                <button onClick={onLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
            // Else, nothing.
          ) : null}
        </ul>
      </nav>
    </header>
  );
}
