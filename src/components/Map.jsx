/// ======================================= Map.jsx =======================================

// Responsabilité : affiche la carte Mapbox avec les bornes wifi en marqueurs
// Les marqueurs s'adaptent aux bornes affichées (hotspots) reçues en props

// ---- IMPORT ----------------------------------------------------------------------------

import { useEffect, useRef } from "react";

// ---- CONSTANTES ------------------------------------------------------------------------

// Bounding box Nantes Métropole — filtre les coordonnées aberrantes
const BOUNDS = {
  lonMin: -2.0,
  lonMax: -1.2,
  latMin: 46.9,
  latMax: 47.5,
};

// ---- HELPERS ---------------------------------------------------------------------------

/**
 * Vérifie si les coordonnées d'une borne sont dans la zone Nantes Métropole.
 * @param {Object} hotspot
 * @returns {boolean}
 */
function isInBounds(hotspot) {
  if (!hotspot.location) return false;
  const { lon, lat } = hotspot.location;
  return (
    lon >= BOUNDS.lonMin &&
    lon <= BOUNDS.lonMax &&
    lat >= BOUNDS.latMin &&
    lat <= BOUNDS.latMax
  );
}

/**
 * Construit le HTML du popup d'un marqueur.
 * @param {Object} hotspot
 * @returns {string}
 */
function buildPopupHTML(hotspot) {
  const site = (hotspot.site || "Inconnu").replaceAll("_", " ");
  const adresse = hotspot.adresse || "—";
  const commune = hotspot.commune || "—";
  return `
    <div class="popup-title">${site}</div>
    <div class="popup-row"><span class="popup-value">${adresse}</span></div>
    <div class="popup-row"><span class="popup-value">${commune}</span></div>
  `;
}

// ---- COMPONENT -------------------------------------------------------------------------

/**
 * Map reçoit hotspots en props depuis Body (via useHotspots)
 * À chaque changement de hotspots, les marqueurs sont mis à jour
 */
function Map({ hotspots }) {
  // useRef : garde une référence stable à la div conteneur
  // sans déclencher de re-rendu quand elle change
  const mapContainerRef = useRef(null);

  // useRef pour stocker l'instance mapboxgl.Map
  // et les marqueurs actifs — sans les mettre dans useState
  // (ce ne sont pas des données React, juste des objets Mapbox)
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // ---- Initialisation de la carte (une seule fois au montage) ----------

  useEffect(() => {
    // mapboxgl est chargé via le <script> dans index.html
    // on vérifie qu'il est bien disponible
    if (!window.mapboxgl) {
      console.error("Mapbox GL JS n'est pas chargé.");
      return;
    }

    window.mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    mapRef.current = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-1.55, 47.216671],
      zoom: 12,
    });

    // Nettoyage au démontage du composant
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // [] = une seule fois au montage

  // ---- Mise à jour des marqueurs quand hotspots change -----------------

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !hotspots?.length) return;

    // Supprime les anciens marqueurs
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Filtre les bornes hors bounding box
    const validHotspots = hotspots.filter(isInBounds);
    if (validHotspots.length === 0) return;

    // Crée un marqueur + popup pour chaque borne valide
    validHotspots.forEach((hotspot) => {
      const popup = new window.mapboxgl.Popup({ maxWidth: "260px" }).setHTML(
        buildPopupHTML(hotspot),
      );

      const marker = new window.mapboxgl.Marker()
        .setLngLat([hotspot.location.lon, hotspot.location.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Recadre la carte pour inclure tous les marqueurs visibles
    const bounds = new window.mapboxgl.LngLatBounds();
    markersRef.current.forEach((marker) => bounds.extend(marker.getLngLat()));

    // fitBounds doit attendre que la carte soit chargée
    if (map.isStyleLoaded()) {
      map.fitBounds(bounds, { padding: 40, maxZoom: 13, duration: 600 });
    } else {
      map.once("load", () => {
        map.fitBounds(bounds, { padding: 40, maxZoom: 13, duration: 600 });
      });
    }
  }, [hotspots]); // se relance à chaque changement de hotspots

  // ---- RENDU -------------------------------------------------------------

  return <div id="map" ref={mapContainerRef} />;
}

// ---- EXPORT ----------------------------------------------------------------------------

export default Map;

// Forcer invalidation HMR

if (import.meta.hot) {
  import.meta.hot.invalidate();
}

// ---- Notes d'intégration ---------------------------------------------------------------
//
// 1. Ajouter dans Body.jsx :
//    import Map from "./Map.jsx";
//    et dans le JSX : <Map hotspots={hotspots} />
//
// 2. Le token Mapbox doit être dans .env :
//    VITE_MAPBOX_TOKEN=pk.eyJ1...
//
// 3. index.html charge déjà mapboxgl via <script> et le CSS via <link> — rien à changer.
//
// 4. La div #map a ses styles dans index.css (width: 75%, aspect-ratio: 16/9, etc.)
//
// ---- Pourquoi useRef et pas useState ? -------------------------------------------------
//
// useState  → React re-rend le composant quand la valeur change
// useRef    → stocke une valeur mutable SANS déclencher de re-rendu
//
// L'instance mapboxgl.Map et les marqueurs ne sont pas des données à afficher :
// ce sont des effets de bord gérés par Mapbox lui-même.
// Les stocker dans useState provoquerait des re-rendus inutiles et casserait la carte.

// invalidation HMR :

/*

import.meta.hot est l'API que Vite injecte automatiquement en mode dev (elle vaut undefined en build de prod, d'où le if pour ne pas planter en production).
invalidate() dit à Vite : "ce module ne peut pas être mis à jour à chaud proprement, force un rechargement complet de la page" — exactement ce qu'il te faut puisque ton instance Mapbox est créée une seule fois dans un useEffect(() => {}, []) et ne se réinitialise pas avec un simple hot-update.

*/
