// ======================================= App.jsx =======================================
//todo : à redécouper

// Responsabilité : composant racine de l'application :
// - centralise état global
// - orchestre appels API
// - distribue données aux composants enfants via les props.
// équivalent de state.js + loader.js + main.js

// ---- IMPORT ----------------------------------------------------------------------------

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css"; // local, style
import Body from "./components/Body.jsx";

// ---- COMPONENT -------------------------------------------------------------------------

function App() {
  // arbre JSX

  return (
    <>
      <Header />
      <Body />
      <Footer />
    </>
  );
}

// ---- EXPORT ----------------------------------------------------------------------------
export default App;
