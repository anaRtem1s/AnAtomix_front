# Description of the project

- RSS & Atom feed Aggregator in the browser (JavaScript Full Stack web dev school project) :: Front-end code.

## React + Vite

- Using ESLint with JavaScript + React Compiler.







// └── src/
//     ├── main.jsx                  ← entry point: mounts <App />
//     ├── App.jsx                   ← frontend ROUTES = screens only (/ , /login, /register)
//     ├── index.css                 ← global styles (your table layout CSS)
//     ├── assets/                   ← images, logos...
//     ├── general_layout/           ← same header+footer EVERYWHERE, written once
//     │   ├── Layout.jsx            ← <Header /> + <Outlet /> + <Footer />
//     │   ├── Header.jsx            ← logo/title + NAV: search btn + Logout/Login (moves between screens)
//     │   └── Footer.jsx            ← license and shit
//     └── pages/
//         ├── auth/                 ← standalone screens (full-page forms)
//         │   ├── Login.jsx
//         │   └── Register.jsx
//         └── reader/               ← the reader: ONE screen, two boxes side by side
//             ├── ReaderPage.jsx    ← the table: <LeftBar /> | center (list ⇄ article)
//             ├── LeftBar.jsx       ← MENU :
//             │                        - categories        → fetch /api/articles?category=X
//             │                        - tags              → fetch /api/articles?tag=X
//             │                        - new-tag input     → POST /api/tags
//             │                        - feeds management  → POST/DELETE /api/feeds
//             │                        - theme + display   → stored state / localStorage
//             ├── ArticlesList.jsx  ← center: list of articles, onPick on click
//             ├── ArticleItem.jsx   ← one row of that list
//             └── MainReader.jsx    ← center: prints ONE article + Back button