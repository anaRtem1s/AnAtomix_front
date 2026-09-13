import { useState, useEffect } from 'react';


export default function Header({ account, onLogout, onNav }) {
    // --- DIAGNOSTIC LINE ---
  console.log("🔴 HEADER DEBUG - Account received:", account); 
  const go = (e, screenId) => {
    e.preventDefault();
    if (onNav) onNav(screenId);
  };

  return (
    <header className="header">
      <h1>AnAtomix: RSS | Atom Aggregator</h1>
      <nav>
        <ul className="header-nav">
          {/* If user exists, show button.  */}
          {account? (
            <li>
              <button onClick={onLogout} className="btn">
                Logout
              </button>
            </li>
            // Else, nothing.
          ) : null}
        </ul>
      </nav>
    </header>
  );
}

// export default function Header({ onNav }) { //! TO RECONSIDER


//     const [isLoggedIn, setIsLoggedIn] = useState(false);

//     // CHECK STATUS WHEN HEADER LOADS

//     useEffect(() => {

//         // Check if the token exists in localStorage

//         const token = localStorage.getItem("token");
//         if (token) {
//             setIsLoggedIn(true);
//         } else {
//             setIsLoggedIn(false);
//         }

//     }, []); // = This runs only once when the component mounts

//     // HANDLE LOGOUT CLICK

//     const handleLogout = () => {

//         // Delete the token

//         localStorage.removeItem("token");
//         localStorage.removeItem("user"); 

//         // Force a full page reload ==> resets the app state and makes the Header re-check (finding no token)

//         window.location.reload();
//     };

//     const go = (e, screenId) => { //! empêche le saut de hash inutile
//         e.preventDefault();
//         if (onNav) onNav(screenId); //!  prévient App.jsx : "affiche cet écran"
//     };

//     return (
//         <header className="header">
//             <h1>AnAtomix: RSS | Atom Aggregator</h1>

//             <nav>
//                 <ul className="header-nav">
//                     {/* If isLoggedIn is TRUE, show the Logout button.
//                                          If FALSE, show nothing here. */}
//                     {isLoggedIn ? (
//                         <li>
//                             <button
//                                 onClick={handleLogout}
//                                 className="btn">
//                                 Logout
//                             </button>
//                         </li>
//                     ) : (

//                         null
//                     )}
//                 </ul>
//             </nav>
//         </header>
//     );
// }
