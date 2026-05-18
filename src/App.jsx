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
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css"; // local, style

// ---- COMPONENT -------------------------------------------------------------------------

function App() {
  // ces 4 états remplacent state.js
  const [hotspots, setHotspots] = useState([]); // [bornes affichées]
  const [query, setQuery] = useState(""); // recherche en cours
  const [offset, setOffset] = useState(0); // pt de départ pagination
  const [totalCount, setTotalCount] = useState(0); // total renvoyé par API
  // chargement
  const [loading, setLoading] = useState(false);
  // gestion erreur
  const [error, setError] = useState(null);

  // valeur calculée à partir des états existants
  // recalculée automatiquement à chaque rendu
  const displayLoadMore = offset + initResultToShow < totalCount;

  /**
   * récupère les données et gère les requêtes API
   * @param {string} query recherche user
   * @param {number} offset pagination
   * @param {boolean} append affichage des nouvelles bornes
   */
  const fetchData = async (query, offset, append) => {
    setLoading(true);
    try {
      const data = await requestAPI(query, offset);
      if (append) {
        setHotspots((prev) => [...prev, ...data.results]);
        // opérateur spread permet de fusionner deux tableaux
        // prev = bornes déjà affichées
        // data.results = nouvelles bornes
        // [...prev, ...data.results] // → les deux tableaux mis bout à bout
      } else {
        setHotspots(data.results); // remplace
      }
      setTotalCount(data.total_count);
    } catch (err) {
      setError("Une erreur est survenue."); // message lisible pour l'utilisateur
    } finally {
      setLoading(false); // s'exécute toujours, succès ou échec
    }
  };

  // useEffect : chargt init
  // [] vide : s'exécute 1 seule fois
  // remplace loading(query, offset, true)
  //! fetchData n'est pas directement appelé dans la fonction car App se ré-exécute à chaque changement d'état.
  //! Sans useEffect, le fetch se relancerait en boucle infinie

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
    <>
      <Header />

      <main className="section" id="data">
        {loading && <p>Chargement...</p>}
        {error && <p>{error}</p>}

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

      <Footer />
    </>
  );
}

// ---- EXPORT ----------------------------------------------------------------------------
export default App;
