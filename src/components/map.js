// ========================================================================
// map.js — gestion de la carte Mapbox (codé avec Maélie)
// ========================================================================
// Responsabilité unique : initialise la carte et gère les marqueurs
// ========================================================================

// ---- URL API -----------------------------------------------------------

const url = `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_wifi-public-exterieur-nantes-metropole/records`;

// ---- Initialisation ----------------------------------------------------

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/maelie/cmb7nnzmz00r901pact8o1xtf",
  center: [-1.55, 47.216671],
  zoom: 12,
});

// ---- Stockage des marqueurs actifs -------------------------------------
// Permet de les supprimer proprement via clearMarkers()
// loader.js appelle clearMarkers() avant chaque nouveau chargement

let activeMarkers = [];

// ---- Bounding box Nantes Métropole -------------------------------------
// Filtre les coordonnées aberrantes (ex: Orvault_Bibliotheque lon:1.888, lat:46.6)

const BOUNDS = {
  lonMin: -2.0,
  lonMax: -1.2,
  latMin: 46.9,
  latMax: 47.5,
};

/**
 * Vérifie si les coordonnées d'une borne sont dans la zone Nantes Métropole.
 * @param {Object} marker : borne wifi
 * @returns {boolean}
 */
function isInBounds(marker) {
  const { lon, lat } = marker.location;
  return (
    lon >= BOUNDS.lonMin &&
    lon <= BOUNDS.lonMax &&
    lat >= BOUNDS.latMin &&
    lat <= BOUNDS.latMax
  );
}

// ---- Chargement initial ------------------------------------------------

fetchMarkers();

// ---- fetchMarkers() ----------------------------------------------------

/**
 * Récupère toutes les bornes depuis l'API et les affiche sur la carte.
 * Appelée une seule fois à l'initialisation.
 */
export async function fetchMarkers() {
  const response = await fetch(url);
  const data = await response.json();
  const markers = data.results;
  addMarkersToMap(markers);
  fitMapToActiveMarkers();
}

// ---- clearMarkers() ----------------------------------------------------

/**
 * Supprime tous les marqueurs actifs de la carte et vide le tableau.
 * Appelée par loader.js quand append === false (nouvelle recherche ou chargement initial).
 */
export function clearMarkers() {
  activeMarkers.forEach((marker) => marker.remove());
  activeMarkers = [];
}

// ---- addMarkersToMap() -------------------------------------------------

/**
 * Crée et ajoute un marqueur avec popup pour chaque borne valide.
 * Les bornes hors bounding box Nantes Métropole sont ignorées.
 * Après ajout, recalcule les bounds pour inclure tous les marqueurs actifs.
 * Appelée par loader.js à chaque chargement (initial, recherche, charger plus).
 * @param {Array} markers : tableau de bornes renvoyé par l'API
 */
export function addMarkersToMap(markers) {
  markers.filter(isInBounds).forEach((marker) => {
    const popup = new mapboxgl.Popup({ maxWidth: "260px" }).setHTML(
      buildPopupHTML(marker),
    );

    const mapMarker = new mapboxgl.Marker()
      .setLngLat([marker.location.lon, marker.location.lat])
      .setPopup(popup)
      .addTo(map);

    activeMarkers.push(mapMarker);
  });

  // Recalcule les bounds après chaque ajout pour inclure tous les marqueurs actifs
  fitMapToActiveMarkers();
}

// ---- fitMapToActiveMarkers() -------------------------------------------

/**
 * Recalcule les bounds à partir des marqueurs actifs en mémoire.
 * Appelée après chaque ajout de marqueurs pour garder tous les points visibles.
 */
function fitMapToActiveMarkers() {
  if (activeMarkers.length === 0) return;
  const bounds = new mapboxgl.LngLatBounds();
  activeMarkers.forEach((marker) => bounds.extend(marker.getLngLat()));
  map.fitBounds(bounds, { padding: 40, maxZoom: 13, duration: 0 });
}

// ---- buildPopupHTML() --------------------------------------------------

/**
 * Construit le contenu HTML du popup d'un marqueur.
 * @param {Object} marker : borne wifi
 * @returns {string} : HTML du popup
 */
function buildPopupHTML(marker) {
  const site = marker.site.replaceAll("_", " ") || "Inconnu";
  const adresse = marker.adresse || "—";
  const commune = marker.commune || "—";

  return `
    <div class="popup-title">${site}</div>
    <div class="popup-row"><span class="popup-label"></span><span class="popup-value">${adresse}</span></div>
    <div class="popup-row"><span class="popup-label"></span><span class="popup-value">${commune}</span></div>
  `;
}
