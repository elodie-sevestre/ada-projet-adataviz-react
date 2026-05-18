// Hook custom : useHotspots

// IMPORT

import { useState, useEffect } from "react";
import { requestAPI, initResultToShow } from "../api.js"; // fct fetch, const nb résultats/page

function useHotspots() {
  const [hotspots, setHotspots] = useState([]); // [bornes affichées]
  const [query, setQuery] = useState(""); // recherche en cours
  const [offset, setOffset] = useState(0); // pt de départ pagination
  const [totalCount, setTotalCount] = useState(0); // total renvoyé par API
  const [loading, setLoading] = useState(false); // chargement
  const [error, setError] = useState(null); // gestion erreur
  const displayLoadMore = offset + initResultToShow < totalCount; // valeur dynamique

  const fetchData = async (query, offset, append) => {
    setLoading(true);
    try {
      const data = await requestAPI(query, offset);
      if (append) {
        setHotspots((prev) => [...prev, ...data.results]); // ajoute
      } else {
        setHotspots(data.results); // remplace
      }
      setTotalCount(data.total_count);
    } catch (err) {
      setError("Une erreur est survenue."); // message lisible pour l'utilisateur
    } finally {
      // s'exécute toujours, succès ou échec
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(query, offset);
  }, []);

  const handleSearch = async (value) => {
    setQuery(value);
    setOffset(0);
    fetchData(value, 0);
  };

  const handleLoadMore = async () => {
    const newOffset = offset + initResultToShow;
    setOffset(newOffset);
    fetchData(query, newOffset, true);
  };

  return {
    hotspots,
    loading,
    error,
    query,
    totalCount,
    displayLoadMore,
    handleSearch,
    handleLoadMore,
  };
}

export default useHotspots;

/* Les hooks custom : extraire la logique, pas l'interface
Un hook custom comme useHotspots n'est pas un composant — il ne retourne pas de JSX. C'est juste une fonction qui regroupe de la logique réutilisable.
La règle de nommage est un indice : tout ce qui commence par use peut appeler d'autres hooks (useState, useEffect...). Une fonction normale ne peut pas.
Imagine que demain tu veuilles faire une deuxième page avec la même logique de fetch + pagination, mais une interface différente. Avec tout dans App.jsx, tu dois tout réécrire. Avec useHotspots, tu le branches et tu changes uniquement le JSX.
Ce que useHotspots retournerait : les états (hotspots, loading, error...) et les handlers (handleSearch, handleLoadMore). App.jsx les reçoit et les distribue aux composants visuels — c'est tout.
*/
