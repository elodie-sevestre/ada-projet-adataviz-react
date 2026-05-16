// ============================= api.js =============================

// Responsabilité : construit URL et récupère données brutes
// ommunication avec l'API Nantes Métropole

// ---- URL API -----------------------------------------------------------

const url = `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_wifi-public-exterieur-nantes-metropole/records`;

// ---- Requête principale ------------------------------------------------

export const initResultToShow = 8; // affichage initial

/**
 * Récupère les bornes wifi depuis l'API
 * @param {string} query : commune recherchée
 * @param {number} offset : index de départ des résultats
 * @returns {Promise<Object>} : objet avec results et total_count
 */
export const requestAPI = async (query, offset) => {
  // URLSearchParams construit les paramètres proprement
  const URLparameters = new URLSearchParams();
  URLparameters.set("limit", initResultToShow); // nombre de résultats par page au départ
  URLparameters.set("offset", offset); // index résultat de départ
  if (query) {
    URLparameters.set("where", `commune like '${query}'`);
  }
  try {
    const response = await fetch(`${url}?${URLparameters}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données : ${error}`);
    return null;
  }
};
