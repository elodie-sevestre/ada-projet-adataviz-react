// ======================================= App.jsx =======================================

// Responsabilité : composant racine de l'application :
// - centralise état global
// - orchestre appels API
// - distribue données aux composants enfants via les props.
// équivalent de state.js + loader.js + main.js

// ---- IMPORT ----------------------------------------------------------------------------

import { useState, useEffect } from "react"; // hooks
import { requestAPI, initResultToShow } from "./api.js"; // fct fetch, const nd résultats/page
import SearchBar from "./components/SearchBar.jsx"; // child component
import Card from "./components/Card.jsx"; // child component
import LoadMore from "./components/LoadMore.jsx"; // child component
import "./App.css"; // local, style

// ---- COMPONENT -------------------------------------------------------------------------

function App() {
  // ces 4 états remplacent state.js
  const [hotspots, setHotspots] = useState([]); // [bornes affichées]
  const [query, setQuery] = useState(""); // recherche en cours
  const [offset, setOffset] = useState(0); // pt de départ pagination
  const [totalCount, setTotalCount] = useState(0); // total renvoyé par API

  // valeur calculée à partir des états existants
  // recalculée automatiquement à chaque rendu
  const displayLoadMore = offset + initResultToShow < totalCount;

  const fetchData = async (query, offset, append) => {
    const data = await requestAPI(query, offset);
    // append contrôle comment les nouvelles bornes sont intégrées
    if (append) {
      // false : remplace hotspots : chargt init, new search
      // true : ajoute hotspots : btn load more
      // ... opérateur spread permet de fusionner deux tableaux
      // prev = bornes déjà affichées
      // data.results = nouvelles bornes
      // [...prev, ...data.results] // → les deux tableaux mis bout à bout
      setHotspots((prev) => [...prev, ...data.results]); // ajoute
    } else {
      setHotspots(data.results); // remplace
    }
    setTotalCount(data.total_count);
  };

  // useEffect : chargt init
  // [] vide : s'exécute 1 seule fois
  // remplace loading(query, offset, true)
  //! fetchData n'est pas directement appelé dans la fonction car App se ré-exécute à chaque changement d'état.
  //! Sans useEffect, le fetch se relancerait en boucle infinie.

  useEffect(() => {
    fetchData(query, offset); // on l'appelle après l'avoir définie
  }, []); // [] = une seule fois au montage

  // fct recherche : reçoit valeur depuis SearchBar via prop onSearch
  // fetchData(value, 0) au lieu de fetchData(query, offset) :
  // car setQuery et setOffset st async, les états ne st pas encore màj à la ligne suivante,
  // il faut utiliser les svaleurs locales value et 0
  const handleSearch = async (value) => {
    setQuery(value);
    setOffset(0);
    fetchData(value, 0);
  };

  // fct pagination : calcul newOffset avt de màj état
  // append=true pr ajouter les résultats à la liste
  const handleLoadMore = async () => {
    const newOffset = offset + initResultToShow;
    setOffset(newOffset);
    fetchData(query, newOffset, true);
  };

  // arbre JSX

  return (
    // <>...</> : fragment React, remplace la <div> racine ss ajouter d'élémt ds le DOM
    <>
      <header className="section" id="top">
        <h1 id="app-title">Besoin de vous connecter gratuitement?</h1>
        <h6>#radins4ever</h6>
      </header>

      <main className="section" id="data">
        <SearchBar onSearch={handleSearch} />

        {query && (
          <p className="search-results" id="counter">
            "{totalCount} borne(s) trouvée(s)"
          </p>
        )}

        <div className="cards" id="born-list">
          {/* hotspots.map() : crée une <Card /> pr chaque borne
          key={hotspot.site} : id unique obligatoire pr chaque élémt de liste */}
          {hotspots.map((hotspot) => (
            <Card key={hotspot.site} result={hotspot} />
          ))}
        </div>

        <LoadMore
          onLoadMore={handleLoadMore}
          displayLoadMore={displayLoadMore}
        />
        {/* <div id="map"></div> */}
      </main>

      <footer className="section">
        <a href="#top" className="btn" id="back-to-top">
          ↑ Haut de page
        </a>
        <p>© 2026 Elodie Sevestre — Ada Tech School</p>
        <a id="api-url" href="https://data.nantesmetropole.fr">
          Données Nantes Métropole Open Data
        </a>
      </footer>
    </>
  );
}

// ---- EXPORT ----------------------------------------------------------------------------
export default App;

// ## Comparaison vanilla JS → React

// | Vanilla JS | React |
// | `state.js` — variables globales | `useState` dans `App` |
// | `loader.js` — `loading()` | `fetchData()` dans `App` |
// | `main.js` — `loading(query, offset, true)` | `useEffect(() => fetchData(), [])` |
// | `search.js` — `search()` | `handleSearch()` dans `App` |
// | `pagination.js` — `moreLoadButton` | `handleLoadMore()` dans `App` |
// | `render.js` — `renderList()` | `hotspots.map(() => <Card />)` |

// ## Les concepts clés à retenir

// | Concept | Définition courte |
// | **État global** | `useState` dans le composant racine, partagé via props |
// | **Valeur calculée** | Dérivée d'états existants, pas besoin de `useState` |
// | **useEffect** | Exécute du code au montage ou quand des dépendances changent |
// | **Flux descendant** | `App` passe données et fonctions aux enfants via props |
// | **Flux remontant** | Les enfants appellent les fonctions reçues en prop |
// | **append** | Paramètre qui contrôle remplacement vs ajout dans la liste |
// | **Opérateur spread** | `[...a, ...b]` fusionne deux tableaux |
