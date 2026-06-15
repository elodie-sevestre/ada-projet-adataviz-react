# adataviz 📡

Visualisation des bornes wifi publiques de Nantes Métropole — version React.

> Projet réalisé dans le cadre de ma formation à Ada Tech School (2026).
> Migration et refactorisation d'une version vanilla JS vers React 19.

---

## À quoi ça sert ?

Une web app qui permet de trouver les bornes wifi gratuites de Nantes Métropole, filtrables par commune, affichées en cartes et sur une carte interactive Mapbox.

---

## Fonctionnalités

**Recherche par commune** : filtrage en temps réel avec mise à jour simultanée de la liste de cartes, du compteur de résultats et des marqueurs sur la carte

**Carte interactive Mapbox** : marqueurs synchronisés avec les résultats affichés, recadrage automatique, popups au clic (nom, adresse, commune)

**Pagination** : chargement progressif des résultats via bouton "Charger plus"

**Cartes dépliables** : affichage/masquage des détails par borne

**Filtrage géographique** : bounding box Nantes Métropole pour exclure les coordonnées aberrantes

---

## Stack technique

**Frontend** : React 19 / Vite
**Cartographie** : Mapbox GL JS
**Données** : API REST Open Data Nantes Métropole

---

## Architecture

```
src/
├── api.js                  # Requêtes vers l'API Nantes Métropole (fetch, pagination, filtrage)
├── App.jsx                 # Composant racine
├── hooks/
│   └── useHotspots.js      # Hook custom : état global, fetch, recherche, pagination
└── components/
    ├── Body.jsx            # Orchestration des composants, consomme useHotspots
    ├── SearchBar.jsx       # Champ de recherche (input contrôlé)
    ├── Card.jsx            # Carte borne wifi (affichage conditionnel des détails)
    ├── Map.jsx             # Carte Mapbox (marqueurs synchronisés via useRef)
    ├── LoadMore.jsx        # Bouton pagination
    ├── Header.jsx
    └── Footer.jsx
```

---

## Choix techniques notables

**Hook custom `useHotspots`** : centralise toute la logique métier (fetch, pagination, gestion d'état, gestion d'erreur) et l'expose aux composants via une interface claire. Les composants ne gèrent que l'affichage.

**`useRef` pour Mapbox** : l'instance `mapboxgl.Map` et les marqueurs sont stockés dans des refs plutôt que dans le state React. Ce sont des effets de bord gérés par Mapbox, pas des données à afficher. Ça évite les re-rendus inutiles et les conflits avec le cycle de vie React.

**Bounding box géographique** : filtre les bornes avec des coordonnées hors Nantes Métropole avant de les passer à Mapbox, pour éviter des marqueurs placés à des milliers de kilomètres.

---

## Prérequis

Node.js v18+, pnpm, un token Mapbox

---

## Installation

Cloner le repo :

```bash
git clone https://github.com/elodie-sevestre/ada-projet-adataviz-react.git
cd ada-projet-adataviz-react
```

Créer un fichier `.env` à la racine :

```
VITE_MAPBOX_TOKEN=votre_token_ici
```

Installer les dépendances et lancer :

```bash
pnpm install
pnpm dev
```

L'application est accessible sur `http://localhost:5173`.

---

## Données

[Nantes Métropole Open Data](https://data.nantesmetropole.fr) — bornes wifi publiques extérieures.
Endpoint : `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_wifi-public-exterieur-nantes-metropole/records`

---

_© 2026 Elodie Sevestre — Ada Tech School_
